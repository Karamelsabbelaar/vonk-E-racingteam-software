#!/bin/bash
# KartPit - Setup Script with Language Selection

# Language selection
clear
echo ""
echo "====================================="
echo "   KartPit - Language Selection"
echo "====================================="
echo ""
echo "1. Nederlands"
echo "2. English"
echo ""
read -p "[*] Selecteer taal / Select language (1 or 2): " LANG

if [ "$LANG" == "1" ]; then
    # Dutch
    LANG_TITLE="[*] KartPit - Capacitor Setup"
    LANG_SUBTITLE="[*] =============================="
    LANG_NODE_CHECK="[-] Node.js niet gevonden. Installeer van https://nodejs.org/"
    LANG_NODE_FOUND="[+] Node.js gevonden"
    LANG_NPM_CHECK="[-] npm niet gevonden. Installeer Node.js."
    LANG_NPM_FOUND="[+] npm gevonden"
    LANG_INSTALL="[*] Afhankelijkheden installeren..."
    LANG_INSTALL_SUCCESS="[+] Afhankelijkheden succesvol geinstalleerd"
    LANG_INSTALL_FAIL="[-] Fout bij installatie van afhankelijkheden"
    LANG_CAPACITOR="[*] Capacitor instellen..."
    LANG_CONFIG="[!] capacitor.config.json niet gevonden. Aanmaken..."
    LANG_COMPLETE="[+] Setup voltooid!"
    LANG_NEXT="[*] Volgende stappen voor Android APK:"
    LANG_DETAILS="[*] Voor gedetailleerde instructies, zie: APK_SETUP.md"
elif [ "$LANG" == "2" ]; then
    # English
    LANG_TITLE="[*] KartPit - Capacitor Setup"
    LANG_SUBTITLE="[*] =============================="
    LANG_NODE_CHECK="[-] Node.js not found. Please install from https://nodejs.org/"
    LANG_NODE_FOUND="[+] Node.js found"
    LANG_NPM_CHECK="[-] npm not found. Please install Node.js."
    LANG_NPM_FOUND="[+] npm found"
    LANG_INSTALL="[*] Installing dependencies..."
    LANG_INSTALL_SUCCESS="[+] Dependencies installed successfully"
    LANG_INSTALL_FAIL="[-] Failed to install dependencies"
    LANG_CAPACITOR="[*] Setting up Capacitor..."
    LANG_CONFIG="[!] capacitor.config.json not found. Creating..."
    LANG_COMPLETE="[+] Setup complete!"
    LANG_NEXT="[*] Next steps for Android APK:"
    LANG_DETAILS="[*] For detailed instructions, see: APK_SETUP.md"
else
    echo "Invalid choice. Please run again."
    exit 1
fi

clear
echo ""
echo "$LANG_TITLE"
echo "$LANG_SUBTITLE"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "$LANG_NODE_CHECK"
    exit 1
fi

echo "$LANG_NODE_FOUND: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "$LANG_NPM_CHECK"
    exit 1
fi

echo "$LANG_NPM_FOUND: $(npm -v)"
echo ""

# Install dependencies
echo "$LANG_INSTALL"
npm install

if [ $? -eq 0 ]; then
    echo "$LANG_INSTALL_SUCCESS"
else
    echo "$LANG_INSTALL_FAIL"
    exit 1
fi

echo ""
echo "$LANG_CAPACITOR"

# Check if capacitor.config.json exists
if [ ! -f "capacitor.config.json" ]; then
    echo "$LANG_CONFIG"
    npx cap init
fi

echo ""
echo "$LANG_COMPLETE"
echo ""
echo "$LANG_NEXT"
echo "  $LANG_STEP1"
echo "  $LANG_STEP2"
echo "  $LANG_STEP3"
echo "  $LANG_STEP4"
echo ""
echo "$LANG_DETAILS"
echo ""
