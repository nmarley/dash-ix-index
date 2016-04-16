# Dash IX Index Node

Dash InstantX index in Node.JS and based on Insight-API.

Indexes Dash InstantX transaction ids and offers JSON API access to the IX index.

This is just a temporary measure to enable IX support until such a time as this feature is added to the Dash JSONRPC interface.

**Requires a current, working version of Insight-Dash.**

### Installation

Install dependencies:

    npm i

Set Insight url in ENV and run app with node:

    INSIGHT_DASH_URL=insight-dash.something.com node index.js

By default, app will listen on standard express port (3000).

For testnet, set the INSIGHT\_NETWORK variable. To specify the port #, set IXINDEX\_PORT. E.g., to run on testnet and listen on port 5000:

    INSIGHT_DASH_URL=http://testnet.insight.blackcarrot.be/ INSIGHT_NETWORK=testnet IXINDEX_PORT=5000 node index.js

### Routes

    GET /ixlist -- list of all txids which have IX locks.

    GET /is_ix/<txid> -- returns true or false, whether given txid is found in index or not

### TODO

Make the above routes RESTful.

Refactor to extract config and routes from express server setup.


### Usage:

    curl localhost:3000/ixlist

or

    curl localhost:3000/is_ix/<txid>

Set up behind a nginx reverse proxy and make available to the internet on any domain name/port you want.

### License

Released under the terms of the MIT License. See <https://opensource.org/licenses/MIT> for more information.

