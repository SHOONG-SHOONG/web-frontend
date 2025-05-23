pipeline {
    agent any

    environment {
        IMAGE_NAME = "harbor.shoong.store/shoong-frontend/${env.JOB_BASE_NAME}"
        TAG = "${BUILD_NUMBER}"
        HARBOR_CREDENTIALS_ID = "Harbor"
        MANIFEST_REPO = "https://github.com/SHOONG-SHOONG/k8s-manifests.git"
        SERVICE_NAME = "web-frontend"
        AWS_REGION = 'ap-northeast-2'
        S3_BUCKET = 'shoong-front'
        CLOUDFRONT_DIST_ID = credentials('CLOUDFRONT_DIST_ID')
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
