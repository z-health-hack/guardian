# Hawking's Mate
Hawking's Mate is a platform to support ALS patients during the course of their disease. The integrated
artificial intelligence has been trained on countless disease courses and is now able to act in advance
for patients. In a long term the platform can become the central location for acquiring and analyzing ALS
related data and accelerate, support research.

## Repository structure and setup
The repository is structured into backend and frontend. The backend is a Python Django microservice
and the frontend is an Angular application. How to setup the repository for development, please have a look
at the Readmes of the backend and frontend:
- [Backend](backend/README.md)
- [Frontend](frontend/guardian/README.md)

## System Architecture
- Cloud Deployment
- Scalable with cloud capabilities
- Ussage of managed services (Cloud SQL, Cloud Run, Firebase)
![System Architecture](_doc/system-architecture.png)

## Deployment
- Fully Automated CI/CD Pipeline
