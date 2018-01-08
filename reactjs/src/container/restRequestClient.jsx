/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

import axios from 'axios';
import aws4 from 'aws4';

export default function restRequest(requestParams) {
  var pathArray = requestParams.url.split('/');
  console.log(pathArray);
  var host = pathArray[2];
  var path = pathArray.slice(3).join("/");
  path = "/" + path;
  requestParams.host = host;
  requestParams.path = path;

  var config = {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }

  if(sessionStorage.getItem('awsCredentials') != null) {
    const awsCredentials = JSON.parse(sessionStorage.getItem('awsCredentials'));
    console.log("awsCrediential:");
    console.log(awsCredentials);
    let signedRequest = aws4.sign(requestParams,
      {
        secretAccessKey: awsCredentials.secretAccessKey,
        accessKeyId: awsCredentials.accessKeyId,
        sessionToken: awsCredentials.sessionToken
      });
    console.log(signedRequest);

    delete signedRequest.headers['Host'];
    delete signedRequest.headers['Content-Length'];



    signedRequest.data = signedRequest.body;
    console.log(signedRequest);
    console.log(config);

    return axios(signedRequest, config)
      .then((response) => {
        return response.data;
      })
      .catch(function (error) {
        console.log("return error");
        console.log(error);
        throw error;
      });
  } else {
    console.log('empty crediential');
    let unsignedRequest = requestParams.url;
    if(requestParams.method == 'GET') {
      return axios.get(unsignedRequest, config);
    }
    else if(requestParams.method == 'POST') {
      return axios.post(unsignedRequest, config);
    }
  }
}