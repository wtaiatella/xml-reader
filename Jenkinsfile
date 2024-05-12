pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                // Comandos para build
                npm run build
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