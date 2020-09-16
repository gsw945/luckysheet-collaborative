import webpackMockServer from "webpack-mock-server";
import nodePath from "path";
import fs from "fs";
import express from 'express';

export default webpackMockServer.add((app, helper) => {
  const router = express.Router()
  router.all('/api/:action', function (req, res, next) {
    let file = nodePath.join(__dirname, "mock", `${req.params.action}.json`);
    if (fs.existsSync(file)) {
      res.sendFile(file, {
        headers: {
          'content-type': 'text/plain; charset=UTF-8'
        }
      }, function (err) {
        if (err) {
          next(err)
        } else {
          console.log('Sent:', file)
        }
      });
    }
    else {
      console.log(`file [${file}] not found`);
      next();
    }
  })
  app.use(router);
})
