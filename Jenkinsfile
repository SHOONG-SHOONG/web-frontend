pipeline {
    agent any

    environment {
        IMAGE_NAME = "harbor.shoong.store/shoong-frontend/${env.JOB_BASE_NAME}"
        TAG = "${BUILD_NUMBER}"
        HARBOR_CREDENTIALS_ID = "Harbor"
        MANIFEST_REPO = "https://github.com/SHOONG-SHOONG/k8s-manifests.git"
        SERVICE_NAME = "${env.JOB_BASE_NAME}"
        AWS_REGION = 'ap-northeast-2'
        S3_BUCKET = 'shoong-front'
        CLOUDFRONT_DIST_ID = 'EOU0KTHUPG6CS'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git url: 'https://github.com/SHOONG-SHOONG/web-frontend.git', branch: 'develop'
            }
        }

        stage('Build React App') {
            steps {
                sh '''
                npm install
                npm run build
                '''
            }
        }

        
        stage('Upload to S3') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-basic-creds', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh '''
                    export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

                    echo "🪣 S3 업로드 시작"
                    aws s3 sync build/ s3://${S3_BUCKET}/ --region ${AWS_REGION} --delete
                    '''
                }
            }
        }
        
        stage('Invalidate CloudFront Cache') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'aws-basic-creds', usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                    sh '''
                    export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                    export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

                    echo "➡️ CloudFront 캐시 무효화 시작"
                    aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DIST_ID} --paths "/*"
                    '''
                }
            }
        }

        
        post {
            success {
                echo "📢 프론트엔드 S3 배포 + CloudFront 캐시 무효화 완료!"
            }
            failure {
                echo "😵‍💫 배포 실패. 로그를 확인해 주세요."
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:latest ."
                sh "docker tag ${IMAGE_NAME}:latest ${IMAGE_NAME}:${TAG}"
            }
        }

        stage('Login to Harbor') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${HARBOR_CREDENTIALS_ID}", usernameVariable: 'HARBOR_USER', passwordVariable: 'HARBOR_PASS')]) {
                    sh "echo $HARBOR_PASS | docker login http://harbor.shoong.store -u $HARBOR_USER --password-stdin"
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                sh "docker push ${IMAGE_NAME}:latest"
                sh "docker push ${IMAGE_NAME}:${TAG}"
            }
        }

        stage('Update Manifest Repo') {
          steps {
            withCredentials([usernamePassword(credentialsId: 'webhook', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
              sh '''
                echo "🔁 Manifest 레포 업데이트 시작"
        
                # 1. clone manifest repo
                rm -rf k8s-manifests
                git clone https://${GIT_USER}:${GIT_TOKEN}@github.com/SHOONG-SHOONG/k8s-manifests.git
        
                # 2. 경로 이동 (프론트엔드로 수정)
                cd k8s-manifests/apps/web-frontend
        
                # 3. 이미지 태그 교체
                sed -i "s|image: harbor.shoong.store/web-frontend/[^:]*:[^[:space:]]*|image: ${IMAGE_NAME}:${TAG}|" deployment.yaml
        
                # 4. commit & push
                git config user.name "jenkins-bot"
                git config user.email "jenkins@shoong.store"
                git add deployment.yaml
                git commit -m "☑️ web-frontend: Update image tag to ${TAG}"
                git push origin develop
              '''
            }
          }
        }

    }

    post {
        success {
            echo "🎀 ${env.SERVICE_NAME} 프론트엔드 자동 빌드완료!"
        }
        failure {
            echo "😡 ${env.SERVICE_NAME} 빌드 실패!"
        }
    }
}
