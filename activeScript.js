////////////Updating Repeated Blocks//////////////////////////////////
////////////Updating Repeated Blocks//////////////////////////////////
on("change:repeating_weapons:weapondieamount change:repeating_weapons:weapondie sheet:opened", function () {
    getAttrs(["repeating_weapons_weaponDieAmount", "repeating_weapons_weaponDie"], function (values) {
        let quantity = String(values["repeating_weapons_weaponDieAmount"]);
        let dice = String(values["repeating_weapons_weaponDie"]);
        let rolly = quantity.concat(dice);
        console.log(rolly)

        setAttrs({
            "repeating_weapons_WeaponDamageDiceRolled": rolly
            // str1.concat(str2);
        });
    });
});

on("change:repeating_weapons:attackattribute sheet:opened", function () {
    getAttrs(["repeating_weapons_AttackAttribute", "Physicality", "Finesse", "Endurance", "Intellect", "Will", "Awareness"], function (values) {
        let pick = parseInt(values["repeating_weapons_AttackAttribute"]) || 0
        let phy = parseInt(values["Physicality"]) || 0;
        let fin = parseInt(values["Finesse"]) || 0;
        let end = parseInt(values["Endurance"]) || 0;
        let int = parseInt(values["Intellect"]) || 0;
        let wil = parseInt(values["Will"]) || 0;
        let awa = parseInt(values["Awareness"]) || 0;
        let used = 50;

        if (pick == 0) {
            used = phy;
        } else if (pick == 1) {
            used = fin;
        } else if (pick == 2) {
            used = end;
        } else if (pick == 3) {
            used = int;
        } else if (pick == 4) {
            used = wil;
        } else if (pick == 5) {
            used = awa
        }

        setAttrs({
            "repeating_weapons_AttackAttributeBonus": used
        });
    });
});
//////////Attack Options////////////////////////////
const repeatingSum = (destinations, section, fields) => {
    if (!Array.isArray(destinations)) destinations = [destinations.replace(/\s/g, '').split(',')];
    if (!Array.isArray(fields)) fields = [fields.replace(/\s/g, '').split(',')];
    getSectionIDs(`repeating_${section}`, idArray => {
        const attrArray = idArray.reduce((m, id) => [...m, ...(fields.map(field => `repeating_${section}_${id}_${field}`))], []);
        getAttrs([...attrArray], v => {
            const getValue = (section, id, field) => v[`repeating_${section}_${id}_${field}`] === 'on' ? 1 : parseFloat(v[`repeating_${section}_${id}_${field}`]) || 0;
            const commonMultipliers = (fields.length <= destinations.length) ? [] : fields.splice(destinations.length, fields.length - destinations.length);
            const output = {};
            destinations.forEach((destination, index) => {
                output[destination] = idArray.reduce((total, id) => total + getValue(section, id, fields[index]) * commonMultipliers.reduce((subtotal, mult) => subtotal * getValue(section, id, mult), 1), 0);
            });
            setAttrs(output);
        });
    });
};

on('change:repeating_attackoptions:attackoptionused sheet:opened', function () {
    repeatingSum("AAOAttackBonus", "attackoptions", ["AttackOptionAttackBonus", "AttackOptionUsed"]);
    repeatingSum("AAODamageBonus", "attackoptions", ["AttackOptionDamageBonus", "AttackOptionUsed"]);
});
