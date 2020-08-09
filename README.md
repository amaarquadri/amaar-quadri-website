# My Personal Website
This repository contains a Django project for hosting my personal website.
The front-end is created using React and Bootstrap.

## Getting Started
- Ensure Python and Node Package Manager (npm) are installed
- Install requirements: \
`pip install -r requirements.txt` \
`cd website/frontend` \
`npm install`

## Running the Website Locally
- In a terminal: \
`cd website` \
`python launch.py`
- Open in web browser: \
`localhost:8000/`

## Repository Notes
The dev branch represents the active working branch. \
The master branch represents a stable release, which is being deployed on my personal Raspberry Pi web server. \
The master branch is perpetually ahead of the dev branch by a few commits, which correspond to updates to
`website/website/settings.py` that ensure that the proper settings are enabled for a live deployment.
