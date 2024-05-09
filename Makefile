.DEFAULT_GOAL := help
.PHONY: help

help: ## 🛟  Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-7s\033[0m %s\n", $$1, $$2}'

# - Clean - #

clean: ## 🧹 Clean all the build files
	@echo "🧹 Clean all the build files"
	rm -fr node_modules
	rm -fr build
	rm -fr .svelte-kit
	make down
	docker system prune -a -f
	docker volume prune -a -f
	@echo " "

# - Running - #

be: ## ⚙️ Run the backend locally
	@echo "⚙️ Run the backend locally"
	docker compose up -d
	@echo " "

down: ## ⛔ Stop the running backend in docker
	@echo "⛔ Stop the running backend"
	docker compose down
	docker compose -f docker-compose.prod.yml down
	@echo " "

fe: ## ⚙️ Run the frontend locally
	@echo "⚙️ Run the frontend locally"
	pnpm install && pnpm run dev

# sleep 2 is needed to wait for the admin server to start
# before the webapp tries to connect to it and generate the schema
# check the webapp/package.json for the predev and prebuild scripts
dev:
	make be 
	sleep 2 && make fe 
