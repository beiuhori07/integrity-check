pipeline {
    agent any

    tools {
        maven 'Maven3' // Name of the Maven installation to use
        jdk 'JDK8' // Name of the JDK installation to use
    }

    stages {
        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }

        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }

        // Add more stages for deployment or further testing if needed
        stage('Deploy') {
            steps {
                // Assuming you have a script to deploy your application
//                 sh './deploy.sh'
                echo 'deploying......'
            }
        }
    }

    post {
        always {
            // Actions to perform after the pipeline runs, e.g., cleanup, notifications
        }
    }
}
