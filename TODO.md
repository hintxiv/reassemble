* [x] Pets             
* [X] Debuff raid buffs
    * [X] Call getDebuffsJSON in parser, somehow sync it up by timestamp in the parser's event generator
    * [X] "Enemy" class with targetKey, maintain debuffs
* [ ] Conditional buffs
* [ ] Wildfire ("applydebuffstack" event is used here)
* [ ] Precast actions / statuses
* [ ] Input validation
* [ ] Potency estimation (pp, apex)
* [ ] Keying for AoE dots (bioblaster)?
* [ ] Gear / level sync (ultimates only?)
* [ ] High / low roll range in output
* [ ] Deal with loosey goosey API key
* [ ] Pet racial stats... *sigh*
* [ ] Tier auto-finder is slightly off

## Simulator overhaul
* [X] Base Entity class
    * [X] Keyed by actorID, then by targetInstance
    * [X] Enemy (map)
    * [X] Player
* [ ] Simulator collects cast info from Player
    * [ ] Need a flag for applied debuff (send this w/ targetKey Enemy)
* [ ] Simulator manages buffs/debuffs for all Entities