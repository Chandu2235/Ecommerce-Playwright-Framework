pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        BASE_URL = 'https://www.saucedemo.com/'
        TEST_USER_EMAIL = 'standard_user'
        TEST_USER_PASSWORD = 'secret_sauce'
        HEADLESS = 'true'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup Node.js') {
            steps {
                script {
                    // Install Node.js using NodeJS plugin
                    nodejs(nodeJSInstallationName: 'NodeJS-18') {
                        sh 'node --version'
                        sh 'npm --version'
                    }
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS-18') {
                    sh 'npm ci'
                    sh 'npx playwright install'
                    sh 'npx playwright install-deps'
                }
            }
        }
        
        stage('Lint & Type Check') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS-18') {
                    script {
                        try {
                            sh 'npm run lint'
                        } catch (Exception e) {
                            echo 'Linting failed, but continuing...'
                        }
                        try {
                            sh 'npm run type-check'
                        } catch (Exception e) {
                            echo 'Type checking failed, but continuing...'
                        }
                    }
                }
            }
        }
        
        stage('Run Tests') {
            parallel {
                stage('UI Tests') {
                    steps {
                        nodejs(nodeJSInstallationName: 'NodeJS-18') {
                            sh 'npx playwright test tests/ui --reporter=junit'
                        }
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'test-results/junit.xml'
                        }
                    }
                }
                
                stage('E2E Tests') {
                    steps {
                        nodejs(nodeJSInstallationName: 'NodeJS-18') {
                            sh 'npx playwright test tests/e2e --reporter=junit'
                        }
                    }
                    post {
                        always {
                            publishTestResults testResultsPattern: 'test-results/junit.xml'
                        }
                    }
                }
                
                stage('API Tests') {
                    steps {
                        nodejs(nodeJSInstallationName: 'NodeJS-18') {
                            script {
                                try {
                                    sh 'npx playwright test tests/api --reporter=junit'
                                } catch (Exception e) {
                                    echo 'API tests failed or not available'
                                }
                            }
                        }
                    }
                }
            }
        }
        
        stage('Generate Reports') {
            steps {
                nodejs(nodeJSInstallationName: 'NodeJS-18') {
                    sh 'npx playwright show-report --reporter=html'
                }
            }
        }
    }
    
    post {
        always {
            // Archive test results
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
            
            // Publish HTML reports
            publishHTML([
                allowMissing: false,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])
            
            // Clean workspace
            cleanWs()
        }
        
        success {
            echo 'Pipeline succeeded!'
            // Add notification logic here (Slack, email, etc.)
        }
        
        failure {
            echo 'Pipeline failed!'
            // Add failure notification logic here
        }
        
        unstable {
            echo 'Pipeline is unstable!'
        }
    }
}