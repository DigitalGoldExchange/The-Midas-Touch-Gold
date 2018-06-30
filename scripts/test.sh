local accounts=(
    --account="0x7C231D6267904cA586f2DbC3AC26E8DDa23317f7,1000000000000000000000000"
    --account="0x51FE498C33DcF2FDdBD4b84Ba93C1840Fb7f80A8,1000000000000000000000000"
    --account="0xcFC78B14b51c7d6609263D71838e5aC183c9d9ae,1000000000000000000000000"
    --account="0x751A1d7CBA72c185c02c4d4D47A4D0DD1a01877B,1000000000000000000000000"
    --account="0xc91c87d5b407647ED39156934c3040F9F50bC4c4,1000000000000000000000000"
    --account="0xd6f208Abf6308b3D657dDF7122754675B2CaF2de,1000000000000000000000000"
    --account="0x80cfC93E6B55f39F5D19ab275E5575b4e2b8c148,1000000000000000000000000"
    --account="0x4CEF7ebD7Cdf02B8b036079989eBED95326adCcC,1000000000000000000000000"
    --account="0x9A774237009A17d890d9D6b5D1cbBCF3BC673B73,1000000000000000000000000"
    --account="0x327cCaB6Da1694CF4Ba48117cbB868AAC5E61A5e,1000000000000000000000000"
    --account="0xb178cf12d4126ea1db48ca32e3ce6743580ca664,1000000000000000000000000"
  )

  if [ "$SOLIDITY_COVERAGE" = true ]; then
    node_modules/.bin/testrpc-sc --gasLimit 0xfffffffffff --port "$ganache_port" "${accounts[@]}" > /dev/null &
  else
    node_modules/.bin/ganache-cli --gasLimit 0xfffffffffff "${accounts[@]}" > /dev/null &
  fi
  ganache_pid=$!
}

if ganache_running; then
  echo "Using existing ganache instance"
else
  echo "Starting our own ganache instance"
  start_ganache
fi

if [ "$SOLC_NIGHTLY" = true ]; then
  echo "Downloading solc nightly"
  wget -q https://raw.githubusercontent.com/ethereum/solc-bin/gh-pages/bin/soljson-nightly.js -O /tmp/soljson.js && find . -name soljson.js -exec cp /tmp/soljson.js {} \;
fi

if [ "$SOLIDITY_COVERAGE" = true ]; then
  node_modules/.bin/solidity-coverage

  if [ "$CONTINUOUS_INTEGRATION" = true ]; then
    cat coverage/lcov.info | node_modules/.bin/coveralls
  fi
else
  node_modules/.bin/truffle test "$@"
fi
