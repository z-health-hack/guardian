# Hawking's Mate
Hawking's Mate is a platform to support ALS patients during the course of their disease. The integrated
artificial intelligence has been trained on countless disease courses and is now able to act in advance
for patients. In a long term the platform can become the central location for acquiring and analyzing ALS
related data and accelerate, support research in this area.

## Repository structure and setup
The repository is structured into a backend and frontend region. The backend is a Python Django microservice
and the frontend is an Angular application. How to setup the repository for development, please have a look
at the Readmes of the backend and frontend:

- [Backend](backend/README.md)
- [Frontend](frontend/guardian/README.md)

## System Architecture
The System was designed to be hosted in the Cloud or On-Premise. It is preferable to use a cloud environment to take advantage of managed services. However, because of the sensitivity of the data, a separate hosting with a service provider is also conceivable, the application can be transferred as a whole. Another big topic for our solution was scalability. For scaling our application to a thousands of users, we relay on auto-scaling features of the cloud providers. This means, if we want to scale out, we simply can scale the number of instances and vertically scale the database.

![System Architecture](_doc/system-architecture.png)

In the architecture diagram, it is shown how the system is setup. We use Google Firebase for hosting the static content and also use their Content Delivery Network (CDN) for low latency. API requests are routed through Firebase to our scalable backend. This in turn access the managed Cloud SQL database instance.

## Deployment
The deployment is fully automated through a continuous deployment pipeline with github actions. For creating a new version, please follow these steps:

1. Go to github and klick releases on the right
2. Go to "Draft new release"
3. Insert a new version number and click create release
4. In the background there is now the frontend build and deployed to firebase and also the docker image build, pushed to GCR
and the Cloud Run configuration updated.
5. You have a now a new release. Have fun!

## Try it out
Try out the application yourself on [https://health-hack-guardian.web.app/](https://health-hack-guardian.web.app/)!

- Log in by pressing the button "Login as patient" on the right-hand side
- On the subsequently displayed dashboard you can see the following:
  - Top: Current stage of the disease (large icon) and prediction of time until the next stage.
  - Left-hand side: Patient profile and suggestions for actions to take before reaching the next stage.
  - Center: Measured data points.
- Click on "Simulator" in the upper right-hand corner to open the data generator in a new browser tab.
- Select "Start Simulation" to start generating (synthetic) data points.
- The simulator will continuously create new data.
- Switch back to the dashboard while the simulator is running to see live updates in the graphs.
- When certain threshold values are reached the stage icon and suggestion will update.
- Logout (top right-hand corner) and login again with a different user, for example via "Login as physician".
- With the role physician you can initially select a patient profile.


## Limitations:
- Currently the measurement data is shared between all concurrent sessions. If multiple simulators run at the same time they will interfere!
- If there is already existing data starting a new simulation will start from the beginning and produce non-continuous data. In this case, please stop the simulator and click "Reset All Data" on the simulator page.
- If there is only little data the prediction will not be possible. Start the simulator and wait a while for the predictions to become more accurate.
