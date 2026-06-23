pipeline {
    agent any

    tools {
        nodejs 'Node16'
    }

    environment {
        DOCKER_REGISTRY       = 'kandpal03'
        DOCKER_IMAGE          = 'kandpal-transport'
        DOCKER_CREDENTIALS_ID = 'docker-cred'

        GIT_REPO_URL          = 'https://github.com/kandpal03/kandpal-transport.git'
        GIT_BRANCH            = 'main'
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo 'Pulling code from GitHub...'
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO_URL}"
            }
        }

        stage('Check Versions') {
            steps {
                sh 'node -v'
                sh 'npm -v'
                sh 'docker --version'
                sh 'ls -la'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building single Docker image from root Dockerfile...'
                sh "docker build -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest ."
            }
        }

        stage('DockerHub Login') {
            steps {
                echo 'Logging in to DockerHub...'
                withCredentials([usernamePassword(
                    credentialsId: "${DOCKER_CREDENTIALS_ID}",
                    usernameVariable: 'DOCKER_USERNAME',
                    passwordVariable: 'DOCKER_PASSWORD'
                )]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                echo 'Pushing Docker image to DockerHub...'
                sh "docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"
            }
        }

        stage('Deployment Info') {
            steps {
                echo 'Docker image pushed successfully.'
                echo "Image: ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }

        failure {
            echo 'Pipeline failed.
        }

        always {
            echo 'Cleaning workspace...'
            cleanWs()
        }
    }
}
