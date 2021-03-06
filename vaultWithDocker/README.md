# Vault with Docker

This is a simple sample project to determine how to run Vault in a Docker container with a file system backend.

## File system
The file system has 4 folders configured:

- Config: Stores the configuration files we use to initialize Vault. The current config file does the following:
  - Setup vault to run with a file system backend
  - Provides the path to Vault
  - Disables tls (do not do this in production)
  - Enables the Vault UI
- Data: Data that Vault generates. This is not checked in.
- logs: Logs generated by Vault. If the audit functionality is enabled in Vault, this is where the resulting flies will be stored. To enable auditing:

```bash
vault audit enable file file_path=/vault/logs/audit.log
```

- Policies: this is Vault stores the policies that control access to secrets. This affects only user created secrets and does not affect how Vault works internally.

## Running Vault

### DockerFile

To start Vault using the dockerfile, run:

```bash
docker run --cap-add=IPC_LOCK --name=devvault vault
```

This will start Vault and makes it accessible in ```localhost:8200```

#### Vault using the CLI

To access vault using the CLI within the container itself:

```bash
docker exec -it devvault sh
export VAULT_ADDR='http://0.0.0.0:8200'
vault login
```
Note: When asked for a token at login, enter the root token that was given on container start up

After that you can enter regular Vault commands

### Docker-compose

The dockercompose file is setup to start Vault in server mode as such after start up it needs to be unsealed using the unseal keys that were printed on screen when Vault started up. If you ran Vault on detached mode, you will need to look at the container logs to find these keys. Without these keys, you cannot unseal Vault.  Note that you can always change the docker-compose file to start Vault in development mode which comes unsealed (modify the command line in the docker-compose file).

The docker- compose file also setups the mappings to the file system, applies the config file and sets the IPC_LOCK parameter

To start the server just run :

```bash
docker-compose up
```
