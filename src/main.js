#!/usr/bin/env node

import {getProfile} from './profile.js'
import {getBalanceChange} from "./balanceChange.js";
import {WALLET_ADDRESS} from "./settings.js";

(async () => {
    //const profileData = await getProfile(WALLET_ADDRESS)
    const result = await  getBalanceChange(WALLET_ADDRESS, '9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump')
    console.table(result)
})();
