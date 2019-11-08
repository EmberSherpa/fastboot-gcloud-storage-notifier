# fastboot-gcloud-storage-notifier
This is a notifier plugin for `fastboot-app-server`. It is to be used in conjunction with [fastboot-app-server](https://github.com/ember-fastboot/fastboot-app-server) and [fastboot-gcloud-storage-downloader](https://github.com/EmberSherpa/fastboot-gcloud-storage-downloader). See the [documentation on fastboot-app-server](https://github.com/ember-fastboot/fastboot-app-server#notifiers) to understand what the role of a notifier is.

## Usage
```javascript
// fastboot-server/server.js

const GCloudStorageNotifier = require('fastboot-gcloud-storage-notifier');

let notifier = new GCloudStorageNotifier({
  bucket: <bucket-where-assets-are>,
  key: <path-to-manifest> // e.g. 'fastboot-deploy-info.json'
});

let server = new FastBootAppServer({
  ...
  notifier
});

...
```
