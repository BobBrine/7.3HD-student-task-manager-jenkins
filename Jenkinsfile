pipeline {
    agent any

    environment {
        IMAGE_NAME = "student-task-manager"
        STAGING_CONTAINER = "student-task-manager-staging"
        PROD_CONTAINER = "student-task-manager-prod"
        STAGING_PORT = "3001"
        PROD_PORT = "3000"
    }

    stages {
        stage('1. Build') {
            steps {
                echo 'Building Docker image...'
                bat 'docker build -t %IMAGE_NAME%:%BUILD_NUMBER% .'
                bat 'docker tag %IMAGE_NAME%:%BUILD_NUMBER% %IMAGE_NAME%:latest'
            }
        }

        stage('2. Test') {
            steps {
                echo 'Running automated tests inside Docker...'
                bat 'docker run --rm %IMAGE_NAME%:%BUILD_NUMBER% npm run test:ci'
            }
        }

        stage('3. Code Quality') {
            steps {
                echo 'Running ESLint code quality check...'
                bat 'docker run --rm %IMAGE_NAME%:%BUILD_NUMBER% npm run lint'
            }
        }

        stage('4. Security') {
            steps {
                echo 'Running npm audit security check...'
                bat 'docker run --rm %IMAGE_NAME%:%BUILD_NUMBER% npm run audit'
            }
        }

        stage('5. Deploy to Staging') {
            steps {
                echo 'Deploying app to staging on port 3001...'
                bat 'docker rm -f %STAGING_CONTAINER% || exit /b 0'
                bat 'docker run -d --name %STAGING_CONTAINER% -p %STAGING_PORT%:3000 %IMAGE_NAME%:%BUILD_NUMBER%'
                bat 'powershell -Command "Start-Sleep -Seconds 5"'
                bat 'powershell -Command "Invoke-WebRequest http://localhost:%STAGING_PORT%/health -UseBasicParsing"'
            }
        }

        stage('6. Release to Production') {
            steps {
                echo 'Releasing app to production on port 3000...'
                bat 'docker rm -f %PROD_CONTAINER% || exit /b 0'
                bat 'docker run -d --name %PROD_CONTAINER% -p %PROD_PORT%:3000 %IMAGE_NAME%:%BUILD_NUMBER%'
                bat 'powershell -Command "Start-Sleep -Seconds 5"'
                bat 'powershell -Command "Invoke-WebRequest http://localhost:%PROD_PORT%/health -UseBasicParsing"'
            }
        }

        stage('7. Monitoring') {
            steps {
                echo 'Checking monitoring endpoint...'
                bat 'powershell -Command "Invoke-WebRequest http://localhost:%PROD_PORT%/metrics -UseBasicParsing"'
                echo 'Monitoring endpoint is working.'
            }
        }
    }

    post {
        success {
            echo 'SUCCESS: All 7 pipeline stages passed.'
        }

        failure {
            echo 'FAILED: Check the red stage and fix it.'
        }
    }
}