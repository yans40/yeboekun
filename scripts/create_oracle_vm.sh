#!/bin/bash
# Script de création de VM Oracle Cloud A1.Flex avec retry automatique
# Usage : bash scripts/create_oracle_vm.sh

COMPARTMENT_ID="ocid1.tenancy.oc1..aaaaaaaaukxqmpeclen5bwbrbnlhgse3nqm5nkmhcnmrazdvcqkmzpusofla"
AVAILABILITY_DOMAIN="MEwv:EU-PARIS-1-AD-1"
SUBNET_ID="ocid1.subnet.oc1.eu-paris-1.aaaaaaaa6xtnn2yk7tehckvamznhdcnczd5icj4k7khlav4z2kkibzue3b4q"
IMAGE_ID="ocid1.image.oc1.eu-paris-1.aaaaaaaaniv7ddwkv3qansdhr6cys5kvjoooxtcjzbfxghhcief4tptrcbza"
SSH_KEY="$HOME/.ssh/oracle_gegedot.pub"
DISPLAY_NAME="gegedot-prod"
OCPUS=1
MEMORY_GB=6
RETRY_INTERVAL=60  # secondes entre chaque tentative

echo "Démarrage du script de création VM Oracle Cloud..."
echo "Shape : VM.Standard.A1.Flex ($OCPUS OCPU / $MEMORY_GB GB)"
echo "Région : eu-paris-1"
echo ""

ATTEMPT=0
while true; do
  ATTEMPT=$((ATTEMPT + 1))
  echo "[Tentative $ATTEMPT] $(date '+%H:%M:%S') — lancement..."

  RESULT=$(oci compute instance launch \
    --availability-domain "$AVAILABILITY_DOMAIN" \
    --compartment-id "$COMPARTMENT_ID" \
    --shape "VM.Standard.A1.Flex" \
    --shape-config "{\"ocpus\": $OCPUS, \"memoryInGBs\": $MEMORY_GB}" \
    --image-id "$IMAGE_ID" \
    --subnet-id "$SUBNET_ID" \
    --ssh-authorized-keys-file "$SSH_KEY" \
    --display-name "$DISPLAY_NAME" \
    --assign-public-ip true \
    2>&1)

  if echo "$RESULT" | grep -q '"lifecycle-state"'; then
    echo ""
    echo "✅ VM créée avec succès !"
    echo "$RESULT" | grep -E '"id"|"public-ip"|"lifecycle-state"'
    break
  else
    echo "   Capacité indisponible — prochain essai dans ${RETRY_INTERVAL}s..."
    sleep $RETRY_INTERVAL
  fi
done
