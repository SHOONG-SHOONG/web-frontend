pipeline {
    agent any

    environment {
        IMAGE_NAME = "harbor.shoong.store/shoong-frontend/${env.JOB_BASE_NAME}"
        TAG = "${BUILD_NUMBER}"
        HARBOR_CREDENTIALS_ID = "Harbor"
        SERVICE_NAME = "${env.JOB_BASE_NAME}"
    }

    stages {
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:latest ."
                sh "docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${TAG}"
            }
        }

        stage('Login to Harbor') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${HARBOR_CREDENTIALS_ID}", usernameVariable: 'HARBOR_USER', passwordVariable: 'HARBOR_PASS')]) {
                    sh "echo $HARBOR_PASS | docker login http://192.168.0.6 -u $HARBOR_USER --password-stdin"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh "docker push ${IMAGE_NAME}:latest"
                sh "docker push ${IMAGE_NAME}:${TAG}"
            }
        }
    }

    post {
        success {
            echo "🎀 ${env.SERVICE_NAME} 프론트엔드 자동 빌드 완료!"
        }
        failure {
            echo "😡 ${env.SERVICE_NAME} 빌드 실패!"
        }
    }
}
