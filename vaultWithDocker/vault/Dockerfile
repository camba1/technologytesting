FROM alpine

ENV VAULT_VERSION 1.3.0
RUN mkdir /vault

# dependencies
RUN apk --no-cache add \
      bash \
      ca-certificates \
      wget

# vault
RUN wget --quiet --output-document=/tmp/vault.zip https://releases.hashicorp.com/vault/${VAULT_VERSION}/vault_${VAULT_VERSION}_linux_amd64.zip && \
    unzip /tmp/vault.zip -d /vault && \
    rm -f /tmp/vault.zip && \
    chmod +x /vault

ENV PATH="PATH=$PATH:$PWD/vault"

# Config file
COPY ./config/vault-config.json /vault/config/vault-config.json

EXPOSE 8200
ENTRYPOINT ["vault"]
