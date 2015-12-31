# ptclientside

    http://heckj.github.io/ptclientside/

jQuery in-browser dashboard showing RackHD agile team status against
epics. Something like the PivotalTracker "epics" view in workspace, but
only against RackHD public projects.

Developed with browserify, jquery, bootstrap, and font-awesome

## local development

    npm install
    npm start

## deploy to github pages

    git checkout gh-pages
    npm run bundle
    git commit bundle.js -m "updated bundle"
    git rebase -i origin/master gh-pages
    git push origin gh-pages -f
