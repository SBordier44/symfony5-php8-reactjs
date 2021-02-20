CONSOLE=php bin/console
CMDFILTER=$(filter-out $@,$(MAKECMDGOALS))

.PHONY: console
console: bin
	$(CONSOLE) $(CMDFILTER)

.PHONY: update
update:
	composer update

.PHONY: require
require:
	composer require $(CMDFILTER)

.PHONY: prepare-dev
prepare-dev: bin vendor
	$(CONSOLE) cache:clear --env=dev
	$(CONSOLE) doctrine:database:drop --if-exists -f --env=dev
	$(CONSOLE) doctrine:database:create --env=dev
	$(CONSOLE) doctrine:migration:migrate -n --env=dev
	$(CONSOLE) doctrine:fixtures:load -n --env=dev

.PHONY: jwt-generate
jwt-generate: vendor
	$(CONSOLE) lexik:jwt:generate-keypair --overwrite
