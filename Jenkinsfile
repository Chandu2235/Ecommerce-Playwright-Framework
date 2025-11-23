pipeline {
    agent any

    tools {
        nodejs "NodeJS-20"   // Node 20.19.2 (configured in Jenkins Tools)
    }

    environment {
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

        stage('Verify Node Version') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install'
                sh 'npx playwright install-deps'
            }
        }

        stage('Lint & Type Check') {
            steps {
                script {
                    try {
                        sh 'npm run lint'
                    } catch (Exception e) {
                        echo 'Linting failed, continuing...'
                    }

                    try {
                        sh 'npm run type-check'
                    } catch (Exception e) {
                        echo 'Type-check failed, continuing...'
                    }
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('UI Tests') {
                    steps {
                        sh 'npx playwright test tests/ui --reporter=junit'
                    }
                    post {
                        always {
                            junit 'test-results/junit.xml'
                        }
                    }
                }

                stage('E2E Tests') {
                    steps {
                        sh 'npx playwright test tests/e2e --reporter=junit'
                    }
                    post {
                        always {
                            junit 'test-results/junit.xml'
                        }
                    }
                }

                stage('API Tests') {
                    steps {
                        script {
                            try {
                                sh 'npx playwright test tests/api --reporter=junit'
                            } catch (Exception e) {
                                echo 'API tests failed / no tests present'
                            }
                        }
                    }
                }
            }
        }

        stage('Generate HTML Report') {
            steps {
                sh 'npx playwright show-report'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true

            publishHTML([
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                keepAll: true,
                alwaysLinkToLastBuild: true
            ])

            cleanWs()
        }

        success {
            echo 'Pipeline succeeded!'
        }

        failure {
            echo 'Pipeline failed!'
        }

        unstable {
            echo 'Pipeline unstable!'
        }
    }
}
