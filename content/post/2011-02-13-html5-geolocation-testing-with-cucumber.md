---
image: /covers/html5-geolocation-testing-with-cucumber.jpg
thumbnail: /thumbnails/html5-geolocation-testing-with-cucumber.jpg
date: 2011-02-13
excerpt: In the past months our geolocation service has been changed from a somewhat
  flaky IP lookup to the new HTML5 W3C draft. Our users noticed the difference and
  they are happier of the new level of precision.
tags:
  - programming
title: HTML5 Geolocation Testing with Cucumber
---

<p><strong>[ I wrote this post for <a href="http://frestyl.com" target="_blank">frestyl</a>, you can find the original article <a href="http://frestyl.wordpress.com/2011/01/24/html5-geolocation-testing-with-cucumber/">here</a>. ]</strong></p>

<p>
Here at frestyl we're working hard, using cutting edge technologies to promote their wider-scale adoption and to help set the new standards with our direct experience. In the past months our geolocation service has been changed from a somewhat flaky IP lookup to the new <a href="http://www.w3.org/TR/geolocation-API/" target="_blank">HTML5 W3C draft</a>. Our users noticed the difference and they are happier of the new level of precision.
</p>

<p>
Technically speaking, the migration was challenging because our home page (the natural entry point for a web app) is a huge map which shows the events around the user. Previously, we silently located the user through a server side process, put that location in session, and loaded the map. No big deal, just a classic request/response cycle. However, implementing the new standard means that browsers will notify the user when an application is trying to get their current location.
</p>

<p>
So what is the best way to handle this? Taking a UI page from the mobile development community, we chose to block our application with a modal dialog that aims to focus the user's attention on the browser's location prompt. Once the user responds to the browser, we change the state of the page accordingly. If they accept the geolocalization then we reload the page and display the map with content around the user's current location. Alternatively, if they decline, we prompt the user to explicitly enter a location, any location, around which they would like to base their experience.
</p>

<p>
For frestyl geo is beyond essential, the application works on the assumption that everyone has a location, and so we can't let users dive in until they have specified where they are (or more accurately, where they want to see content for). By using a modal dialog we are taking a risk, but we are also making a bold statement. Location is actually that important. If it is true for mobile platforms &dash; why should we consider a laptop to be any different?
</p>

<p>
Aspirations aside, as you can imagine all this workflow is hard to test. Before we were just mocking the IP lookup against the various scenarios (success/failure/timeout) with RSpec and everyone was happy about it, but now, it's all done via javascript and things are more complicated.
</p>

<p>
We want to share with other people facing similar challenges our experiences of how one might best write integration tests for the new HTML5 standards for Geolocation.
</p>

<h2>Step 1: Clarify the Goals</h2>

<p>
First of all: we separated acceptance tests from behaviors: the former are run via Cucumber (using Capybara) and the latter with BlueRidge (using Screw.Unit). The behaviors were easy to test, we wrapped the HTML5 Geolocation API with: <code>$.location</code> and re-mocked all the scenarios. The hard part was to run integration tests in real browsers (which is the goal of this post).
</p>

<p>
 Let's say we want to run this Cucumber feature:

{{< highlight cucumber >}}
  @javascript
  Scenario: User is geolocalized
    When I go to the home page page
    And I share my location and it returns "41.8954656,12.4823243"
    Then I should see a "Location found at: 41.8954656, 12.4823243" message
{{< / highlight >}}
</p>

<h2>Step 2: Proxy the API</h2>

<p>
For obvious security reasons, developers can't access the Geolocation prompt that the browser gives to the user. This means that we can't even simulate a user click on accept (or reject) of the location lookup. So what to do? The main idea was to completely replace the Geolocation system while the tests were running, but if you try to assign something to <code>navigator.geolocation</code> the browser raises an exception (or ignores it entirely, like Chrome).
</p>

<p>
Our solution was to use a proxy to access to the wrapped API:
</p>

{{< highlight javascript >}}
  $.location = {
    // window.geolocation_provider is useful for testing purposes, not used in
    // development/staging/production envs.
    geolocation_provider: window.geolocation_provider || navigator.geolocation
  }

   // usage:
  $.location.geolocation_provider.getCurrentLocation(successCallback, errorCallback)
{{< / highlight >}}

<h2>Step 3: Rack to the Rescue</h2>

<p>
Sounds great, yeah? Let's get to the interesting part: we need to set the <code>window.geolocation_provider</code> before the DOM is ready (the usual hook we use to initialize all the page scripts), otherwise the browser will still continue using <code>navigator.geolocation</code>.
</p>

<p>
To solve this we used a Rack middleware to inject some javascript just after the <code>&lt;head&gt;</code> tag is opened, so the browser immediately executes it, assigning the value we want to mock.
</p>

<h2>Step 4: Simulate Scenarios</h2>

<p>
 We're not done yet, we still need to simulate user choice (accept/deny), Geolocation success, timeout and error scenarios. We easily can set from Ruby some Javascript top level vars for this purpose and let our implementation behave accordingly.

{{< highlight javascript >}}
// simplified code
var state = null;

function getCurrentPosition( success, error, options ) {
  if( state == 'timeout' )
    simulateTimeoutError();
}
{{< / highlight >}}

{{< highlight ruby >}}
# Cucumber step
page.execute_script "state = 'timeout';"
{{< / highlight >}}
</p>

<h2>Step 5: Celebrate</h2>

<p>
Okay, so we've managed to write reasonable integration tests and taken you through the biggest problems we encountered. You can find an example of a fully-working Rails 3 application using the HTML5 Geolocation standard with all the corresponding Cucumber scenarios implemented <a href="https://github.com/frestyl/html5-geo-cucumber" target="_blank">here</a>.
</p>
