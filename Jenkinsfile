pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        BACKEND_IMAGE  = "yourdockerhubuser/traveltripped-backend"
        FRONTEND_IMAGE = "yourdockerhubuser/traveltripped-frontend"
        IMAGE_TAG      = "${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh 'mvn test -B'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                dir('backend') {
                    sh "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} -t ${BACKEND_IMAGE}:latest ."
                }
                dir('frontend') {
                    sh "docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest ."
                }
            }
        }

        stage('Push Docker Images') {
            when {
                branch 'main'
            }
            steps {
                sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin"
                sh "docker push ${BACKEND_IMAGE}:${IMAGE_TAG}"
                sh "docker push ${BACKEND_IMAGE}:latest"
                sh "docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}"
                sh "docker push ${FRONTEND_IMAGE}:latest"
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh '''
                    docker compose pull
                    docker compose up -d --remove-orphans
                    docker image prune -f
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout'
            cleanWs()
        }
        success {
            echo "Pipeline succeeded — build ${IMAGE_TAG}"
        }
        failure {
            echo "Pipeline failed — check logs above"
        }
    }
}
