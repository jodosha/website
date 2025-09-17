{
  description = "Hugo";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            hugo
            dart-sass
            yamllint
          ];

          # shellHook = ''
          # '';

          # # Environment variables (also set in shellHook for runtime)
          # CGO_ENABLED = "1";
          # GO111MODULE = "on";
        };
      }
    );
}
