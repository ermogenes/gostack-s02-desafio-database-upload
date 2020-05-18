# Desafio 06: Database upload

My solution to the Rockeseat's GoStack challenge.

<!-- ✔ All tests passed. -->
_⏳ work in progress..._

To create database container:

```
docker run --name gostack-desafio06 -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
```

After that, create a empty database on the container named `gostack_desafio06` and run the migration:

```
yarn typeorm migration:run
```


To run tests:

```
yarn test
```

Refs.:

* The challenge: https://github.com/Rocketseat/bootcamp-gostack-desafios/tree/master/desafio-database-upload
* The template: https://github.com/Rocketseat/gostack-template-typeorm-upload

---

Ermogenes Palacio
