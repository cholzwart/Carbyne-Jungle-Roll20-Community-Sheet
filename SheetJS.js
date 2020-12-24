
on("change:repeating_attackoptions:attackoptionused sheet:opened", function () {
    // getSectionIDs gives an array of all the row ids.
    getSectionIDs('AttackOptions', function (ids) {
        if (ids.length === 0) {
            return;
        }
        // need to get an array of all the attributes used in the repeating_items calculations, for getAttrs
        const fieldArray = [];
        ids.forEach(id => fieldArray.push(
            'repeating_attackoptions_${id}AttackOptionUsed', 'repeating_item_${id}_AttackOptionName', 'repeating_item_${id}_AttackOptionAttackBonus', 'repeating_item_${id}_AttackOptionDamageBonus', 'repeating_item_${id}_AttackOptionEffects'
        ));

        getAttrs(fieldArray.concat(['inventory_fixed_digits']), function (item) {
            var attackBonus = 0;//the attack bonus to return
            var damageBonus = 0; //damage bonus to return
            var effects = ""; //initialize the text to return
//            const fixed = +item.inventory_fixed_digits;
//            const items = {}; // initialise an object to hold the total weights and costs.
            ids.forEach(id => {
                //for each for of the table, if used is checked, add the values
                if()

                // for each row of the table, calculate the total weight and cost



                let weight = (+item[`repeating_item_${id}_count`] || 0) * (+item[`repeating_item_${id}_weight`] || 0) * (+item[`repeating_item_${id}_carried`] || 0);
                let cost = (+item[`repeating_item_${id}_count`] || 0) * (+item[`repeating_item_${id}_cost`] || 0);
                // save the totals, in the correct format (if fixed = 1 use the first forumila, if 0, the second)
                items[`repeating_item_${id}_weighttotal`] = fixed ? Number(Math.round(weight * 1000) / 1000).toFixed(3) : Math.round(weight * 1000) / 1000;
                items[`repeating_item_${id}_costtotal`] = fixed ? Number(Math.round(cost * 100) / 100).toFixed(2) : Math.round(cost * 100) / 100;
            });
            setAttrs(items);
        });
    });
});

/* ===== PARAMETERS ==========
destinations = the name of the attribute that stores the total quantity
        can be a single attribute, or an array: ['total_cost', 'total_weight']
        If more than one, the matching fields must be in the same order. 
    section = name of repeating fieldset, without the repeating_
    fields = the name of the attribute field to be summed
          destination and fields both can be a single attribute: 'weight'
          or an array of attributes: ['weight','number','equipped']
*/
const repeatingSum = (destinations, section, fields) => {
    if (!Array.isArray(destinations)) destinations = [destinations.replace(/\s/g, '').split(',')];
    if (!Array.isArray(fields)) fields = [fields.replace(/\s/g, '').split(',')];
    getSectionIDs('repeating_${section}', idArray => {
        const attrArray = idArray.reduce((m, id) => [...m, ...(fields.map(field => 'repeating_${section}_${id}_${field}'))], []);
        getAttrs([...attrArray], v => {
            const getValue = (section, id, field) => v['repeating_${section}_${id}_${field}'] === 'on' ? 1 : parseFloat(v['repeating_${section}_${id}_${field}']) || 0;
            const commonMultipliers = (fields.length <= destinations.length) ? [] : fields.splice(destinations.length, fields.length - destinations.length);
            const output = {};
            destinations.forEach((destination, index) => {
                output[destination] = idArray.reduce((total, id) => total + getValue(section, id, fields[index]) * commonMultipliers.reduce((subtotal, mult) => subtotal * getValue(section, id, mult), 1), 0);
            });
            setAttrs(output);
        });
    });
};

on("change:repeating_attackoptions:attackoptionused sheet:opened", function () {
    repeatingSum("AAOAttackBonus", "attackoptions", ["AttackOptionAttackBonus", "AttackOptionUsed"]);
    repeatingSum("AAODamageBonus", "attackoptions", ["AttackOptionDamageBonus", "AttackOptionUsed"]);
});

/************Target Variables
            <input type="number" name="attr_AAOAttackBonus" value= "555"  disabled="true">
            <input type="hidden" value="Murder Machine" name="attr_ActiveAttackOption">
            <input type="number" name="attr_AAODamageBonus" value="444" disabled="true">
            <input type="hidden" value="I murdered him Avy." name="attr_ActiveAttackOptionEffects">

***********Origin Variables******************************************************************
                        <td><input type="checkbox" name="attr_AttackOptionUsed" value="1"></td>
                        <td><input type="text" class="weaponInfo" name="attr_AttackOptionName"></td>
                        <td><input type="number" class="weaponInfo" value=0 name="attr_AttackOptionAttackBonus"></td>
                        <td><input type="number" class="weaponInfo" value=0 name="attr_AttackOptionDamageBonus"></td>
                        <textarea type="text" name="attr_AttackOptionEffects"></textarea>
 */

const repeatingText = (destinations, section, fields) => {
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



function SetAttackOptionBonuses() {
    getAttrs(["repeating_AttackOptions_AttackOptionUsed", "repeating_AttackOptions_AttackOptionName", "repeating_AttackOptions_AttackOptionAttackBonus", "repeating_AttackOptions_AttackOptionDamageBonus", "repeating_AttackOptions_AttackOptionEffects"], function (values) {
        let quantity = String(values["repeating_weapons_weaponDieAmount"]);
        let dice = String(values["repeating_weapons_weaponDie"]);
        let rolly = quantity.concat(dice);
        console.log(rolly)

        setAttrs({
            "repeating_weapons_WeaponDamageDiceRolled": rolly
            // str1.concat(str2);
        });
    });
}


function CalculateDefense(){
    getAttrs(["repeating_weapons_weaponDieAmount","repeating_weapons_weaponDie"], function(values) {
        let quantity = String(values["repeating_weapons_weaponDieAmount"]);
        let dice = String(values["repeating_weapons_weaponDie"]);
        let rolly = quantity.concat(dice);
        console.log(rolly)
        
        setAttrs({                            
            "repeating_weapons_WeaponDamageDiceRolled": rolly
// str1.concat(str2);
        });
    });
    
}

on("change:finesse change:endurance change:physicality change:bonusstamina sheet:opened", function() {  
     CalculateStamina();
});

function CalculateStamina(){
    getAttrs(["Finesse","Endurance","Physicality","BonusStamina"], function(values) {
        let fin = parseInt(values["Finesse"])||0;
        let end = parseInt(values["Endurance"])||0;
        let phy = parseInt(values["Physicality"])||0;
        let bonusStam = parseInt(values["BonusStamina"])||0;

        let stam = fin+end+phy+bonusStam
        
        setAttrs({                            
            "Stamina": stam
        });
    });
}

function calculateDiscipline(){
    getAttrs(["Intellect","Awareness","Will","BonusDiscipline"], function(values) {
        let int = parseInt(values["Intellect"])||0;
        let awa = parseInt(values["Awareness"])||0;
        let wil = parseInt(values["Will"])||0;
        let bonusDisc = parseInt(values["BonusDiscipline"])||0;

        let disc = int+awa+wil+bonusDisc
        
        setAttrs({                            
            "Discipline": disc
        });
    });
}
function calculatePlating(){

}
function calculateShielding(){

}
function calculateHealthInArmor(){

}
function calculateInitiative(){

}