export const PAGES={"getting-in":{html:`
    <p class="gd-lede">One door, one signature, and no screen between it and the city.</p>
    <ul>
      <li><b>CONNECT WALLET</b> is the way in. Any EIP-6963 wallet on Solana
        Chain signs one message and gets a card; the door then reads
        <b>CONTINUE</b> with your address on it.</li>
      <li><b>There is no way in without a wallet.</b> The wallet is the
        account, so there is no browser-only player to keep. Arrive without
        one and the front page says so, names the chain, and points you at an
        extension — it is a screen with a way forward, not an error.</li>
      <li>A returning connected player is restored from the card: no popup, no
        second signature.</li>
      <li>You can connect from the pause sheet, the locker, the fitting room,
        OFFBOOK or the Stock Room terminal as well. Connecting never reloads
        the game.</li>
    </ul>
    <h3>What the wallet carries</h3>
    <ul>
      <li>Your player is kept against your <b>wallet address</b>, so the same
        wallet on another machine — or in a private window — is the same
        player. Connect, and your character, cash and unlocks come back.</li>
      <li>Exactly this, and nothing else: <b>your character and how they look,
        your name, your cash, your level, what you are wearing, what you have
        unlocked, your last waypoint, and your settings.</b></li>
      <li>Never kept: no email, no IP address, no signature, no key, no
        balance, and nothing your wallet has done anywhere else. The game
        never asks for a transaction and never holds anything that could
        authorise one.</li>
      <li><b>The chain is Solana Network</b> (chain id 4663) and the token is
        <b>$GRIFTEX</b>, an ERC-20 on it. One wallet, one signature: the wallet
        you sign in with is the wallet whose balance is read, and reading it
        costs no second signature.</li>
      <li>Your balance is read <b>on the server</b>, over the chain's own RPC,
        after you sign — never in your browser, and never stored.</li>
      <li>Your browser keeps a copy of the save too, so the game opens
        instantly and still plays offline. If the two disagree, the one saved
        most recently wins.</li>
      <li>Disconnect and that wallet's player stays where it is, against that
        address, for the next time it connects.</li>
    </ul>`},"first-minute":{html:`
    <p class="gd-lede">You spawn on foot, in the city, in the middle of a day
      that was already running.</p>
    <ul>
      <li>You start in <b>STANDARD</b>, the designed default. The start screen
        — the bodies, the controls — is one menu away: <b>P</b> pauses.</li>
      <li><b>E</b> at a car takes it. <b>E</b> at a shop door robs it. <b>E</b>
        at a venue door walks in.</li>
      <li>Walk into a <b>yellow beam</b> to start a mission; the type rotates
        each time.</li>
      <li><b>M</b> is the map. The <b>M</b> totems at the kerb mark metro
        entrances; the freeway loop rings the core.</li>
      <li>The world runs on its own clock: a day is about half an hour,
        sessions open at dusk, and it may rain.</li>
    </ul>
    <h3>The controls</h3>
    <div class="gd-tablewrap"><table>
      <thead><tr><th>Keys</th><th>What they do</th></tr></thead>
      <tbody>
        <tr><td class="k">W A S D</td><td>Move &middot; Drive &middot; Fly</td></tr>
        <tr><td class="k">Mouse &middot; L-Click</td><td>Look and aim &middot; Shoot. Hold to aim and fire.</td></tr>
        <tr><td class="k">R-Click</td><td>Hold to web-swing &middot; tap to zip up. Hold <b>W</b> while swinging to build speed, release at the front of the arc to fly.</td></tr>
        <tr><td class="k">Space &middot; Shift</td><td>Jump / heli up &middot; sprint / nitro / heli down</td></tr>
        <tr><td class="k">F &middot; Q &middot; C &middot; T</td><td>Punch combo or air web-dash &middot; web-shot (again to yank) &middot; super-jump &middot; trampoline</td></tr>
        <tr><td class="k">E</td><td>Enter, take, rob</td></tr>
        <tr><td class="k">1&ndash;6 &middot; Tab</td><td>Weapons &middot; hold for the armory wheel, tap for the next weapon</td></tr>
        <tr><td class="k">V &middot; Z</td><td>Emotes on foot; in a car the camera: chase / close / interior &middot; REX attacks</td></tr>
        <tr><td class="k">R &middot; O &middot; N</td><td>Radio &middot; cruise control &middot; horn; held on foot, wait and skip time</td></tr>
        <tr><td class="k">M &middot; P &middot; G &middot; L</td><td>Map &middot; pause &middot; screenshot &middot; legend board</td></tr>
        <tr><td class="k">H &middot; B</td><td>Start the arena at the stadium &middot; buy property under a green beam; bail out of the seaplane</td></tr>
      </tbody>
    </table></div>
    <p>On a phone: a stick on the left drives, the rest of the screen looks
      around, and the buttons cover swinging, shooting, jumping and actions.
      Open the browser menu and Add to Home Screen &mdash; it installs.</p>`},districts:{html:`
    <p class="gd-lede">Nine of them, and each one is for something.</p>
    <ul>
      <li><b>Downtown</b> &mdash; towers, lobbies, and nowhere to park.</li>
      <li><b>Finance</b> &mdash; one street of glass and a very quiet lobby. The Stock Room is here.</li>
      <li><b>Mid-rise</b> &mdash; four to eight floors of everything at once.</li>
      <li><b>Old Town</b> &mdash; brick, awnings, and the market that never moved.</li>
      <li><b>The Flats</b> &mdash; low, wide, and mostly parking; the metro surfaces here.</li>
      <li><b>The Docks</b> &mdash; sheds, yards, and a fight behind one of them.</li>
      <li><b>Stadium</b> &mdash; a bowl, its car parks, and the bars that feed it.</li>
      <li><b>The Hills</b> &mdash; switchbacks, a lookout, and a sign you can see from downtown.</li>
      <li><b>The Beach</b> &mdash; sand, a boardwalk, a pier, and a marina that never sleeps.</li>
    </ul>
    <h3>Things worth knowing</h3>
    <ul>
      <li>The kerb totem outside the Stock Room reads the chain: block height,
        gas, your linked wallet and tier. When the link is down it says LINK
        OFFLINE rather than a number.</li>
      <li>The jumbotron on the plaza carries the same line when the read is
        live, and the news when it is not.</li>
      <li>Twenty hidden packages sit on rooftops. You find them by swinging up high.</li>
      <li>A green beam over a building means it is for sale (<b>B</b>).</li>
      <li>Moods: a session rolls its own weather and light;
        <code>?mood=NEON_NIGHT</code> and friends pin one.</li>
    </ul>`},transit:{html:`
    <p class="gd-lede">The metro runs to its own clock. Ride it or miss it.</p>
    <ul>
      <li>It runs underground through the core and surfaces on a viaduct in
        the ring, on its own schedule, whether you are there or not.</li>
      <li>An <b>M</b> totem at the kerb marks every entrance; the map and the
        minimap carry the same marks. DOWNTOWN CENTRAL is the core stop;
        FLATS is the elevated one.</li>
      <li>Stand behind the platform edge, board when the doors open, ride to
        any stop, and walk the length of the train if you like. A rider still
        aboard at the end of the line is put off onto the platform.</li>
      <li>Above ground: the freeway loop with its slips and signs, robotaxis
        and taxis, a helicopter, a seaplane, a balloon ride, and the web
        between the towers.</li>
    </ul>`},venues:{html:`
    <p class="gd-lede">Doors that open, and what is behind each one.</p>
    <ul>
      <li><b>THE STOCK ROOM</b> &mdash; the exchange floor in Finance: the
        vault wall, the board, the terminal on the pit podium, four monitors
        under the gallery. THE GALLERY upstairs is a whale-tier door.</li>
      <li><b>LAST CALL</b> &mdash; the bar: stage, booths, a pool table. THE
        BACK ROOM, through the alley door, is a holder-tier door.</li>
      <li><b>IRON CORNER</b> &mdash; the boxing gym by day, the fight club by night.</li>
      <li><b>OFFBOOK</b> &mdash; the store: the current drop on six mannequins,
        a counter and a mirror.</li>
      <li><b>PALM CASINO</b> &mdash; blackjack and the tables. Settlement is
        LOCAL: chips, not chain.</li>
      <li>Plus the stadium arena (<b>H</b>), the shops you can rob, the pier
        and the marina.</li>
    </ul>`},cash:{html:`
    <p class="gd-lede">City cash is what you earn by playing, and it buys
      everything the city sells. <span class="gd-tag gd-dim">LOCAL</span></p>
    <ul>
      <li>Your cash is on the HUD. Missions, heists, stylish moves that land,
        dailies and a robbed till all pay into it.</li>
      <li>The ATM banks it in $500 steps and the bank pays 2% a day. Both are
        the city's own money: they live on this machine, not onchain.</li>
      <li>The kiosk outside the Stock Room quotes a market of real companies on
        simulated prices. Buy a share with the number keys, sell it back.
        Positions are LOCAL and the plate says so.</li>
    </ul>
    <div class="gd-honest">
      <b>Simulated means simulated.</b> The kiosk market fetches nothing. Its
      prices walk on the city's own clock and move on what happens in the
      city; no quote on that plate came from anywhere else, and nothing you do
      at it reaches a real market.
    </div>`},ownership:{html:`
    <p class="gd-lede">What you own follows the wallet.
      <span class="gd-tag">OWNED BY THE WALLET</span></p>
    <ul>
      <li>OFFBOOK sells the current drop: six pieces on six mannequins. Try one
        on for free; owning it binds it to your Solana Network wallet, and it
        follows you into every session.</li>
      <li>The locker holds the collection: EQUIPPED, OWNED, the drop, HOLDER
        and LOCKED pieces, each with one action.</li>
      <li>The city market prices what the city sells on its own supply and
        demand: buy a piece and its shelf thins and the price rises, sell into
        the city and it falls, spend time in a district and what that district
        wants gets dearer. Leave it alone and it drifts back.</li>
      <li>A purchase in this pass goes through the mocked adapter and says so
        on the sheet. Nothing here initiates a transaction.</li>
    </ul>
    <h3>The Stock Room <span class="gd-tag">SOLANA</span></h3>
    <ul>
      <li>The room reads a real vault wallet on Solana Network (chain 4663)
        holding Solana Tokens. The board shows what is in it; the
        terminal shows what was allocated to you.</li>
      <li>A claim in this pass is <b>simulated</b>: no token moves, no hash is
        invented, and the sheet says SIMULATED.</li>
      <li>The chain line everywhere in the room is a live read &mdash; block
        height and gas from the public RPC, tagged LIVE, STALE or OFFLINE by
        its age.</li>
    </ul>`},grift:{html:`
    <p class="gd-lede">$GRIFTEX buys ownership. It never buys power.
      <span class="gd-tag">NOT LIVE</span></p>
    <ul>
      <li><b>City cash and $GRIFTEX are different money.</b> Everything the city
        sells is bought with cash you earned by playing, and a player who never
        holds a token can play all of GRIFT. The token is optional and stays
        optional.</li>
      <li><b>One utility is switched on:</b> burning $GRIFTEX to register a
        piece you already own against your wallet address. 250 $GRIFTEX, all of
        it destroyed &mdash; v1 burns 100%, and a treasury share waits on a
        splitter contract, because one transfer is one transaction and a split
        across two could take your tokens and still leave the claim unwritten.
        Token-priced drops, personalisation and city services are switched off.
        None of it is a weapon, damage, health, armour, a faster car or a way
        past the police.</li>
      <li><b>Registering is not a mint, and nothing arrives in your wallet.</b>
        There is no NFT and no collection contract. What happens onchain is the
        burn, which is public and which anyone can check; what you get is the
        piece recorded against your address in GRIFT, and the burn's
        transaction as the receipt for it.</li>
      <li><b>Trade, never earn.</b> No yield, no automated buying, no token
        paid out as a reward. The game never sends a transaction &mdash; where
        a claim is live, you send it yourself, from your own wallet.</li>
      <li><b>Tiers are a number against a threshold:</b> 1,000 $GRIFTEX for
        holder, 100,000 for whale. HOLDER opens THE BACK ROOM at LAST CALL and
        the holder pieces; WHALE opens THE GALLERY above the Stock Room floor.
        A locked door says one line and never asks you to buy.</li>
    </ul>
    <div class="gd-honest">
      <b>Nothing about the token is live.</b> No $GRIFTEX contract is deployed,
      so every tier reads NONE and the holder doors and pieces stay locked for
      everyone. Claiming today shows you exactly what a claim would cost and
      then does nothing: no token moves, none is destroyed, no transaction is
      sent. Mainnet takes a deliberate configuration and cannot be switched on
      by an environment guess.
      <br><br>
      <b>No burn figure is shown until a real one confirms.</b> Destroyed
      supply counts only a confirmed mainnet transaction, verified against its
      receipt. A testnet burn and a previewed claim are counted on their own
      lines and never added to it, and there is no combined total anywhere.
    </div>`},heat:{html:`
    <p class="gd-lede">Stars are heat, and heat is the city's attention.</p>
    <ul>
      <li>Two stars bring SVPD drones, four bring SWAT, five bring a tank. The
        Stealth suit cools heat faster; so does getting out of sight.</li>
      <li>Rob a store from inside it. Jack a car at the door. Take a mission
        from a yellow beam; the casino has a heist of its own, in through the
        hatch.</li>
      <li>CHAOS on the HUD is the city's read of you. It climbs with what you
        break and settles when you stop.</li>
    </ul>`},progression:{html:`
    <p class="gd-lede">What rises when you play, and what it opens.</p>
    <ul>
      <li>Rep is earned by what you pull off. The tiers: NOBODY, KNOWN,
        FAMOUS, CITY LEGEND, ICON. The HUD names yours.</li>
      <li>LVL is your level; dailies (DAILY on the HUD) set a small goal each
        day, like three hidden packages.</li>
      <li>The arms dealer opens with rep before money; the most-wanted wall
        lists who the city is after.</li>
    </ul>`},property:{html:`
    <p class="gd-lede">A place of your own, and the fleet that gets you there.</p>
    <ul>
      <li>Buy property under a green beam and it is yours.</li>
      <li>Start from a body (STANDARD, HEAVY, SPRINTER, BRAWLER, COLOSSUS,
        LEAPER), then change anything and give it your own name. There is no
        cast to pick from: the character is yours, and it is saved for next
        time.</li>
      <li>Cars have doors, interiors and an interior camera (<b>V</b>). Damage
        is real and shows on the body.</li>
      <li>The metro is free and always running. The freeway loop is the fast
        way round the ring. Taxis and robotaxis run the streets; the robotaxi
        has opinions.</li>
      <li>The helicopter, the seaplane and the balloon are where you find
        them. The skydive beacon is outside the Spire.</li>
    </ul>`}};export const plainText=html=>String(html).replace(/<[^>]+>/g," ").replace(/&mdash;/g,"—").replace(/&ndash;/g,"–").replace(/&middot;/g,"·").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/\s+/g," ").trim();
