## Before beta
* [X] Fix nivo bug in prod
* [ ] Fix stat tiers being slightly off
* [ ] "X" and "refresh" buttons beside the current comparison set
* [ ] Don't push comparison URL to browser history

## Before public release
* [ ] Pet racial stats... *sigh*
* [ ] Input validation / feedback for malformed URLs
* [ ] Precast actions / statuses
* [ ] Conditional buffs (Embolden, AST cards)
* [ ] Failed wildfire potency overrides ("applydebuffstack" event sub-6 stacks)
* [ ] Potency estimation (pp, apex)
* [ ] Snapshotting for multitarget dots (bioblaster)
* [ ] Better UI?? Help

## Future
* [ ] Support for more jobs
* [ ] Gear / level sync (ultimates only?)
* [ ] High / low roll RNG range in DPS output (for ""crit farm sets"")
* [ ] Zoom graph for a specific killtime
* [ ] Meld autosolver 

## Done
* [X] Pets             
* [X] Debuff raid buffs
    * [X] Call getDebuffsJSON in parser, somehow sync it up by timestamp in the parser's event generator
    * [X] "Enemy" class with targetKey, maintain debuffs
* [X] Deal with loosey goosey API key

## Simulator overhaul
* [X] Base Entity class
    * [X] Keyed by actorID, then by targetInstance
    * [X] Enemy (map)
    * [X] Player
* [X] Get raid buff debuffs from Enemies