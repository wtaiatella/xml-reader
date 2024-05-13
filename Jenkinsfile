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
                sh  '/home/mdm/.asdf/shims/npm -v'

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