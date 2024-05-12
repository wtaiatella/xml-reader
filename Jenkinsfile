pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                // Comandos para build
                sh 'pwd'
                sh 'ls -la'
                sh 'whoami'
                sh '/var/lib/jenkins/.nvm/versions/node/v20.13.1/bin/npm install'
                sh '/var/lib/jenkins/.nvm/versions/node/v20.13.1/bin/npm run build'

            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
                // Comandos para testes
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying..'
                // Comandos para deploy
            }
        }
    }
}