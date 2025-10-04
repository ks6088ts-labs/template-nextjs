# Git
GIT_REVISION ?= $(shell git rev-parse --short HEAD)
GIT_TAG ?= $(shell git describe --tags --abbrev=0 --always | sed -e s/v//g)

# Docker
DOCKER_REPO_NAME ?= ks6088ts
DOCKER_IMAGE_NAME ?= template-nextjs
DOCKER_COMMAND ?= echo "Hello, World!"

# Tools
TOOLS_DIR ?= /usr/local/bin
# https://github.com/aquasecurity/trivy/releases
TRIVY_VERSION ?= 0.64.0

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
.DEFAULT_GOAL := help

.PHONY: install-deps-dev
install-deps-dev: ## install dependencies for development
	@# https://aquasecurity.github.io/trivy/v0.18.3/installation/#install-script
	@which trivy || curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b $(TOOLS_DIR) v$(TRIVY_VERSION)
	@# https://pnpm.io/installation
	@which pnpm || npm install -g pnpm
	pnpm install

.PHONY: generate
generate: ## generate code
	pnpm prisma generate

.PHONY: format-check
format-check: ## format check
	@echo "Yet to be implemented"

.PHONY: format
format: ## format code
	pnpm run format

.PHONY: fix
fix: format ## apply auto-fixes

.PHONY: lint
lint: ## lint
	pnpm lint

.PHONY: test
test: ## run tests
	@echo "Yet to be implemented"

.PHONY: build
build: ## build applications
	pnpm build

.PHONY: ci-test
ci-test: install-deps-dev generate format-check lint test build ## run CI test

.PHONY: run
run: ## run applications
	pnpm dev

# ---
# Docker
# ---

.PHONY: docker-build
docker-build: ## build Docker image
	docker build \
		-t $(DOCKER_REPO_NAME)/$(DOCKER_IMAGE_NAME):$(GIT_TAG) \
		--build-arg GIT_REVISION=$(GIT_REVISION) \
		--build-arg GIT_TAG=$(GIT_TAG) \
		.

.PHONY: docker-run
docker-run: ## run Docker container
	docker run --rm $(DOCKER_REPO_NAME)/$(DOCKER_IMAGE_NAME):$(GIT_TAG) $(DOCKER_COMMAND)

.PHONY: docker-lint
docker-lint: ## lint Dockerfile
	docker run --rm -i hadolint/hadolint < Dockerfile

.PHONY: docker-scan
docker-scan: ## scan Docker image
	trivy image $(DOCKER_REPO_NAME)/$(DOCKER_IMAGE_NAME):$(GIT_TAG)

.PHONY: ci-test-docker
ci-test-docker: install-deps-dev docker-lint docker-build docker-scan docker-run ## run CI test for Docker

.PHONY: update
update: ## update dependencies
	pnpm update --latest

# ---
# Project
# ---

.PHONY: migrate
migrate: ## run database migrations
	npx prisma migrate dev --name init

.PHONY: seed
seed: ## seed initial data
	npx tsx ./scripts/seed.ts

.PHONY: studio
studio: ## open Prisma Studio
	npx prisma studio
