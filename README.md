# mpq-party-planner

This is a tool that helps you plan your attack party in Marvel Puzzle Quest.  Marvel Puzzle Quest is a terribly addictive game for iOS, Android, and Steam.  

If you're not playing already, just save yourself now.

If you are already playing, use this tool to help make sure your team selection is optimized!

## How to use this tool

![sample image](app/images/ScreenShot.png?raw=true)

1. Pick a Hero, other heroes will become greyed out if they are not optimal for building a team around that heroes colors
2. Passives will be displayed but will not filter out heroes.

## Setup locally

   yarn global add bower
   yarn global add grunt
   brew install ruby
   gem install compass
   yarn

## Test locally

    grunt serve

## Deploy

    git subtree push --prefix dist origin gh-pages
