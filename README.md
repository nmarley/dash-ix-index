# Dash IX Index Node

Dash InstantX index in Node.JS and based on Insight-API.

Indexes Dash InstantX transaction ids and offers JSON API access to the IX index.

This is just a temporary measure to enable IX support until such a time as this feature is added to the Dash JSONRPC interface.

**Requires a current, working version of Insight-Dash.**

### Installation

Install dependencies:

    npm i

Run app with node:

    node index

By default, app will listen on standard port (3000).

### Routes

    /ixlist -- list of all txids which have IX locks.

    /is_ix/<txid> -- returns true or false, whether given txid is found in index or not

### Usage:

    curl localhost:3000/ixlist

or

    curl localhost:3000/is_ix/<txid>

Set up behind a nginx reverse proxy and make available to the internet on any domain name/port you want.

