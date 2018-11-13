"use strict";

const { Storage } = require('@google-cloud/storage');

const DEFAULT_POLL_TIME = 3 * 1000;

class GCSNotifier {
  constructor(options) {
    this.ui = options.ui;
    this.bucket = options.bucket;
    this.key = options.key;
    this.pollTime = options.poll || DEFAULT_POLL_TIME;
  }

  subscribe(notify) {
    this.notify = notify;

    return this.getCurrentLastModified()
      .then(() => this.schedulePoll());
  }

  getLastModified() {
    let storage = new Storage();
    let bucket = storage.bucket(this.bucket);
    let file = bucket.file(this.key);

    return new Promise(function(resolve, reject){
      file.get(function(err, file, apiResponse){
        if (err) {
          reject(err);
        }
        resolve(apiResponse.updated);
      });
    });
  }

  getCurrentLastModified() {
    return this.getLastModified()
      .then(LastModified => {
        this.lastModified = LastModified;
      })
      .catch(() => {
        this.ui.writeError('error fetching gcloud Storage last modified; notifications disabled');
      });
  }

  schedulePoll() {
    setTimeout(() => {
      this.poll();
    }, this.pollTime);
  }

  poll() {
    this.getLastModified()
      .then(LastModified => {
        this.compareLastModifieds(LastModified);
        this.schedulePoll();
      });
  }

  compareLastModifieds(newLastModified) {
    if (newLastModified !== this.lastModified) {
      this.ui.writeLine('config modified; old=%s; new=%s', this.lastModified, newLastModified);
      this.lastModified = newLastModified;
      this.notify();
    }
  }
}


module.exports = GCSNotifier;
