# Project Title

Companies data display

## About

(strongly suggest to click on link with ctrl because github doesn't allow target="_blank")

Project's live is here: [companiesdatadisplay.netlify.com](https://companiesdatadisplay.netlify.com/)

While it took about 7sec to load due to multiple data fetches I decided to put this data in google firebase and update it every time sbd uses it. Now you don't need to wait so long for data to load. :)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

1. [node.js](https://nodejs.org/en/) - simply download and install it locally on your device.
2. npm - installed along with node.js
3. [parcel](https://parceljs.org/) - module bundler contained in dev dependecies.
4. You got to have your own google firebase with init object, that has collection 'companies';

### Installing

1. open directory from your console
2. change firebase init object to your own in firebaseHandler.js
3. type parcel index.html
4. wait a while
5. your dev environment is up and running

## Deployment

I suggest using some serverless hosting like heroku or netlify.

## Authors

* **Daniel Kłys** - *Initial work* - [DanielKlys7](https://github.com/DanielKlys7)

## License

This project is licensed under the MIT License
