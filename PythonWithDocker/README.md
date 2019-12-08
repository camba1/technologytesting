## Python with Docker, Jenkins and Minikube

This is a sample project on how to dockerize a simple Python/Flask project, automate the build with Jenkins and finally deploy to Kubernetes running in Minikube.

To fully run this project you will need access to a ```Kubernetes``` cluster. The current setup uses a local ```Minikube``` Kubernetes cluster.

Also, you will need access to a Jenkins server to automate the image build. Currently this uses the official Jenkins container running locally, but it can use any Jenkins server.

Finally, the original intention was to get Jenkins to automatically deploy to Kubernetes, but due to time constraints the automation was not completed. If you would like to add this functionality, please fell free to send a pull request. Alternatively, you can see a fully functional sample with a node application, you can see it in this [repo][29ceb316]

### Python app

The python application (app.py) is straight forward. It just displays `hello world from <hostname>` on the browser at `localhost:5000`

#### Running the app

##### DockerFile

To build the image:

```bash
docker build -t firstpythonimg .
```

To run the image:

```bash
docker run --name firstpython -p 5000:5000 firstpythonimg
```

##### Docker-composed

Run the image with

```bash
docker-compose up
```

Note that this will only bring the python application, a jenkins container should also be started manually or this docker-compose file could be modified to start one up as well.

### Kubernetes

The Kubernetes manifest for the python app can be found under ```Kubernetes/appManifests```. There are two manifests:

- Deployment.yaml: Defines how we want to run our application (container).
- Service.yaml: Defines the port we want associated with our application

In the Kubernetes folder we also have Manifests to deploy Jenkins in Kubernetes, but this is not necessary to run the Python app

### Jenkins

We have two Jenkins files in the repo, At this stage they are both basically identical but:

- Jenkinsfile: Was meant to automate the deploy to K8s of the application
- Jenkinsfile_noK8s: Was the original Jenkinsfile that was created to automate the build of the Python application

A pipeline needs to be created in the Jenkins UI and associated with one of the Jenkinsfiles. Additionally,  credentials for pulling the code from source control also need to be added through the Jenkins UI.


  [29ceb316]: https://Bolbeck@bitbucket.org/Bolbeck/mkecodecampnodemysql.git "Link to MKE Code Camp presentation repository"
