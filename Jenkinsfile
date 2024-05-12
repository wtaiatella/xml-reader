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
                sh  '''
                    export NVM_DIR="$HOME/.nvm"
                    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                    nvm use v20.13.1
                    export PATH=$NVM_DIR/versions/node/v20.13.1/bin:$PATH
                    npm install
                '''

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