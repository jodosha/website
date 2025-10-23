---
title: "Why Your `app version` Golang CLI Command Loads Your Database Client (And How to Fix It)"
date: 2025-10-23
description: |
  Golang CLI applications with multiple commands require different dependencies.
  But traditional Dependency Injection loads everything at startup, even for commands you don't use.
tags:
  - go
  - golang
  - dependency injection
  - command line
  - cli
keywords:
  - "Go"
  - "Golang"
  - "CLI"
  - "Cobra Go"
  - "Depedency Injection"
  - "Performance"
  - "Programming Patterns"
---

You type `myapp version` to check the version number.
But behind the scenes, your application loads the database client, git service, API handlers, and file system watchers.
All that code initialization for a command that just prints a version string.

This is the hidden cost of traditional dependency injection in Golang CLI applications.
Every command pays the startup cost of all commands.
This post shows how I solved this problem with a simple two-phase initialization pattern that achieves true lazy loading while keeping tests clean.

## The Problem

CLI applications have multiple commands.
Each command needs different dependencies.
But traditional dependency injection **loads everything at startup**, even for commands you don't use, at the cost of a **slow and slower boot time**.

The `version` command needs one service.
The `init` command needs three services.
But when you run `app version`, why should it load the `init` command's dependencies?
It shouldn't.
Making this work with clean code and testable interfaces is the challenge.

## Stage 1: Centralized Wiring in main.go

My first approach followed standard DI patterns:

```go
// main.go
func run(ctx context.Context) error {
    // Initialize ALL services upfront
    versionService := version.NewService()
    gitService := git.NewService()
    fileService := file.NewService()
    apiService := api.NewService()

    // Initialize ALL views
    versionView := ui.NewVersionView()
    initView := ui.NewInitView()
    // ...

    // Wire commands with their dependencies
    versionCmd := versionCmdPkg.New(versionView, versionService)
    initCmd := initCmdPkg.New(initView, fileService, gitService)
    // ...
}
```

**Problems:**

1. **Unnecessary loading**: `app version` loads git, file, and API services
2. **Startup cost**: Every command pays initialization cost of all commands
3. **Code clutter**: `main.go` becomes a dependency catalog
4. **Tight coupling**: Adding a command requires changing `main.go`

## Stage 2: Command-Level Wiring

Next, I moved dependency wiring to each command:

```go
// main.go - clean!
func main() {
    rootCmd := rootCmdPkg.NewRootCommand()
    rootCmd.AddCommand(
        versionCmdPkg.New(),
        initCmdPkg.New(),
    )
    rootCmd.Execute()
}
```

```go
// internal/cli/version/cmd.go
func New() *cobra.Command {
    // Wire dependencies at the command level
    service := version.NewService()
    view := ui.NewVersionView()

    return &cobra.Command{
        Use:   "version",
        Short: "Display version information",
        RunE: func(cmd *cobra.Command, args []string) error {
            v, _ := service.GetVersion(cmd.Context())
            return view.Render(cmd.Context(), v, cmd.OutOrStdout())
        },
    }
}
```

**Improvements:**

1. Clean `main.go` - no dependency knowledge
2. Each command owns its dependencies
3. Local reasoning - all wiring in one file

**Remaining problems:**

1. **Still loads eagerly**: Cobra calls `versionCmdPkg.New()` at startup
2. **Testing is hard**: Can't inject mock dependencies
3. **No injection point**: Services created inside constructor

When you run `app version`, all commands call their `New()` functions. Each function creates its dependencies. It still loads everything.

## Stage 3: Lazy Loading with Two-Phase Initialization

The solution is splitting initialization into two phases:

1. **Registration phase**: Create command metadata only (flags, help text)
2. **Execution phase**: Create dependencies only when command runs

Here's the pattern:

```go
// internal/cli/version/cmd.go
package version

// New creates command metadata only. Runs at startup for all commands.
func New() *cobra.Command {
    cmd := newCommand()
    cmd.RunE = RunE  // Set execution function
    return cmd
}

func newCommand() *cobra.Command {
    return &cobra.Command{
        Use:   "version",
        Short: "Display version information",
    }
}

// NOTE: RunE creates dependencies only when command executes.
func RunE(cmd *cobra.Command, args []string) error {
    // Lazy loading: dependencies created HERE
    service := internalVersion.NewService()
    view := ui.NewVersionView()

    return runE(cmd, args, view, service)
}

// runE accepts injected dependencies - easy to test.
func runE(cmd *cobra.Command, _ []string, view ui.VersionView, service internalVersion.Service) error {
    ctx := cmd.Context()
    v, err := service.GetVersion(ctx)
    if err != nil {
        return fmt.Errorf("failed to get version: %w", err)
    }
    return view.Render(ctx, v, cmd.OutOrStdout())
}
```

The `main.go` stays simple:

```go
// cmd/myapp/main.go
var rootCmd = cliRootCmd.New()

func main() {
    if err := rootCmd.Execute(); err != nil {
        os.Exit(1)
    }
}

func init() {
    // Register commands - calls New() which creates metadata only
    rootCmd.AddCommand(cliVersionCmd.New())
    rootCmd.AddCommand(cliInitCmd.New())
}
```

**NOTE:** I don't set `cmd.RunE` in `newCommand()`, because this function is used indirectly during CLI execution, and directly as a command factory for the tests. `New()`, on the other hand, is only used during the command at runtime; via my `RunE` I can inject the real dependencies.

## How This Achieves True Lazy Loading

When you run `app version`:

1. **Startup**: `init()` calls `New()` for all commands. Each `New()` creates metadata only. No services (dependencies) loaded.
2. **Execution**: Cobra calls `internal/cli/version.RunE()` (as per `cmd.RunE = RunE` in `New()`). It only loads `version` dependencies.

When you run `app init`:

1. **Startup**: Same - only metadata
2. **Execution**: Cobra calls `internal/cli/init.RunE()`. Only `init` dependencies are loaded.

**Each command's dependencies load only when that command executes.**

## Testing Benefits

The `RunE` + `runE` pattern makes testing simple:

```go
// internal/cli/init/cmd_test.go
package init

// Mock service
type mockInitService struct {
    executeResult *services.InitResult
    capturedOpts  services.InitOptions
}

func (m *mockInitService) Execute(_ context.Context, opts services.InitOptions) (*services.InitResult, error) {
    m.capturedOpts = opts
    return m.executeResult, nil
}

// Mock view
type mockInitView struct {
    successRendered bool
}

func (m *mockInitView) RenderSuccess(_ context.Context, _ *Config, _ string, _ io.Writer) error {
    m.successRendered = true
    return nil
}

func TestInitCommand_ParsesFlags(t *testing.T) {
    mockService := &mockInitService{
        executeResult: &services.InitResult{/* ... */},
    }
    mockView := &mockInitView{}

    // Create command and inject mocks
    cmd := newCommand()
    cmd.RunE = func(cmd *cobra.Command, args []string) error {
        return runE(cmd, args, mockView, mockService)
    }

    cmd.SetArgs([]string{"--force"})
    cmd.Execute()

    assert.True(t, mockService.capturedOpts.Force)
    assert.True(t, mockView.successRendered)
}
```

Test pattern:
1. Create command metadata with `newCommand()`
2. Replace `RunE` with test version that calls `runE()` with mocks
3. No real services - tests are fast and isolated

## Key Benefits

**True Lazy Loading**: Dependencies load only when their command executes. Running `app version` never loads git or file services.

**Fast Startup**: Command metadata is cheap - just structs. Services with I/O or heavy initialization only load when needed.

**Clean Testing**: Tests inject mocks via `runE()`. No complex setup. Tests run fast.

**Simple Main**: The `main.go` stays clean and doesn't know about services.

**Local Reasoning**: Each command file contains metadata, production wiring, and business logic.

## The Pattern

Implement this in three functions:

```go
// 1. Command metadata (runs at startup)
func New() *cobra.Command {
    cmd := newCommand()
    cmd.RunE = RunE
    return cmd
}

func newCommand() *cobra.Command {
    return &cobra.Command{
        Use:   "command-name",
        Short: "Description",
        // flags, help, etc
    }
}

// 2. Production wiring (runs only when command executes)
func RunE(cmd *cobra.Command, args []string) error {
    dep1 := service1.New()
    dep2 := service2.New()
    return runE(cmd, args, dep1, dep2)
}

// 3. Business logic (testable with mocks)
func runE(cmd *cobra.Command, args []string, dep1 Service1, dep2 Service2) error {
    // Parse flags, execute logic, render output
}
```

Test with mock injection:

```go
func TestCommand(t *testing.T) {
    cmd := newCommand()
    cmd.RunE = func(cmd *cobra.Command, args []string) error {
        return runE(cmd, args, mockDep1, mockDep2)
    }
    // Test command
}
```

## Conclusion

I solved two problems with one pattern:

1. **Lazy loading**: Dependencies load only when needed
2. **Testability**: Clean dependency injection for tests

The key insight: split initialization into **two phases**.
Registration creates only the command structure (cheap).
Execution creates dependencies (expensive, but lazy).

The `RunE` + `runE` pattern gives us production code with real dependencies and tests with mock dependencies—no framework magic required.

This pattern works for any command-based application where you want to defer expensive initialization until you know what the user wants to do.
