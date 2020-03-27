on("sheet:opened", function () {
    console.log("Sheet opened, JS is running");
    console.log(maxdice("1d8"))
    console.log(maxdice("33d100"))
});

/********

HELPER FUNCTIONS

********/


function maxdice(damagedice) {
    return parseInt(damagedice) * parseInt(damagedice.slice(damagedice.indexOf("d") + 1));
}

function training(skill) {
    if (skill == 2) {
        return "Adept";
    } else if (skill == 4) {
        return "Trained";
    } else if (skill == 6) {
        return "Experienced";
    } else if (skill == 8) {
        return "Expert";
    } else if (skill == 10) {
        return "Master";
    } else {
        return "Untrained";
    }
}

/********

CORE STATS

********/

on("change:hp_max", function () {
    getAttrs(["HP_max"], function (values) {
        setAttrs({
            "HP-Bloodied": Math.floor(values.HP_max / 2),
            "HP-surgeValue": Math.floor(values.HP_max / 4)
        });
    });
});

on("change:strength", function () {
    getAttrs(["Strength"], function (values) {
        setAttrs({
            strmod: Math.floor(values.Strength / 2 - 5)
        });
    });
});

on("change:constitution", function () {
    getAttrs(["Constitution"], function (values) {
        setAttrs({
            conmod: Math.floor(values.Constitution / 2 - 5)
        });
    });
});

on("change:dexterity", function () {
    getAttrs(["Dexterity"], function (values) {
        setAttrs({
            dexmod: Math.floor(values.Dexterity / 2 - 5)
        });
    });
});

on("change:intelligence", function () {
    getAttrs(["Intelligence"], function (values) {
        setAttrs({
            intmod: Math.floor(values.Intelligence / 2 - 5)
        });
    });
});

on("change:wisdom", function () {
    getAttrs(["Wisdom"], function (values) {
        setAttrs({
            wismod: Math.floor(values.Wisdom / 2 - 5)
        });
    });
});

on("change:charisma", function () {
    getAttrs(["Charisma"], function (values) {
        setAttrs({
            chamod: Math.floor(values.Charisma / 2 - 5)
        });
    });
});

/********

DEFENSES

********/

on(
    "change:ac-att change:strmod change:conmod change:dexmod change:intmod change:wismod change:chamod  change:quest change:ac-armor change:ac-misc",
    function () {
        getAttrs(
            [
                "AC-Att",
                "strmod",
                "conmod",
                "dexmod",
                "intmod",
                "wismod",
                "chamod",
                "Quest",
                "AC-Armor",
                "AC-Misc"
            ],
            function (values) {
                var abimod = 0;
                switch (parseInt(values["AC-Att"])) {
                    case 0:
                        abimod = 0;
                        break;
                    case 1:
                        abimod = values.strmod;
                        break;
                    case 2:
                        abimod = values.conmod;
                        break;
                    case 3:
                        abimod = values.dexmod;
                        break;
                    case 4:
                        abimod = values.intmod;
                        break;
                    case 5:
                        abimod = values.wismod;
                        break;
                    case 6:
                        abimod = values.chamod;
                        break;
                }
                var finalattr =
                    10 +
                    parseInt(abimod) +
                    parseInt(values.Quest) +
                    parseInt(values["AC-Armor"]) +
                    parseInt(values["AC-Misc"]);
                setAttrs({
                    AC: finalattr
                });
            }
        );
    }
);

on("change:strmod change:conmod change:quest change:fort-misc", function () {
    getAttrs(["strmod", "conmod", "Quest", "Fort-Misc"], function (values) {
        var finalattr =
            10 +
            Math.max(parseInt(values.strmod), parseInt(values.conmod)) +
            parseInt(values.Quest) +
            parseInt(values["Fort-Misc"]);
        setAttrs({
            Fort: finalattr
        });
    });
});

on("change:dexmod change:intmod change:quest change:ref-misc", function () {
    getAttrs(["dexmod", "intmod", "Quest", "Ref-Misc"], function (values) {
        var finalattr =
            10 +
            Math.max(parseInt(values.dexmod), parseInt(values.intmod)) +
            parseInt(values.Quest) +
            parseInt(values["Ref-Misc"]);
        setAttrs({
            Ref: finalattr
        });
    });
});

on("change:wismod change:chamod change:quest change:will-misc", function () {
    getAttrs(["wismod", "chamod", "Quest", "Will-Misc"], function (values) {
        var finalattr =
            10 +
            Math.max(parseInt(values.wismod), parseInt(values.chamod)) +
            parseInt(values.Quest) +
            parseInt(values["Will-Misc"]);
        setAttrs({
            Will: finalattr
        });
    });
});

/********

ATTACKS

********/

on("change:bonusdice-entry", function () {
    getAttrs(["bonusdice-entry"], function (values) {
        // var numdice = parseInt(values["bonusdice-entry"]);
        // var size = 4;
        // if (numdice < 10) {
        //     size = parseInt(values["bonusdice-entry"].substring(2));
        // } else {
        //     size = parseInt(values["bonusdice-entry"].substring(3));
        // }
        // var finalattr = numdice * size;
        setAttrs({
            'bonusdice-crit': maxdice(values["bonusdice-entry"])
        });
    });
});


/* ===STANDARD=== */

on("change:repeating_standard:standard-accessory", function (eventInfo) {
    var accessory = eventInfo.newValue;
    var attack = accessory + "-prof";
    var damage = accessory + "-Damage";
    var brutal = accessory + "-Brutal";
    var brutN = accessory + "-BrutN";
    var crit = accessory + "-HighCrit";
    if (accessory.substring(0, 3) == "wep") {
        getAttrs(
            [attack, damage, brutal, brutN, crit, "level", "quest"],
            function (values) {
                var damagedice = values[damage];
                if (values[brutal] == "r<") {
                    damagedice = damagedice + values[brutal] + values[brutN];
                }
                var critdice = values["quest"] + "d6";
                if (values[crit] == "true") {
                    critdice =
                        critdice +
                        " + " +
                        parseInt(damagedice.substring(0, 1)) *
                        Math.ceil(parseInt(values["level"]) / 5) +
                        damagedice.substring(1);
                }
                setAttrs({
                    "repeating_Standard_Standard-HitBonus-accessory": parseInt(
                        values[attack]
                    ),
                    "repeating_Standard_Standard-damagedice": damagedice,
                    "repeating_Standard_Standard-critdice": critdice
                });
            }
        );
    } else {
        getAttrs([attack, damage, "quest"], function (values) {
            var critdice = values["quest"] + "d6";
            setAttrs({
                "repeating_Stanard_Standard-HitBonus-accessory": parseInt(
                    values[attack]
                ),
                "repeating_Standard_Standard-damagedice": values[damage],
                "repeating_Standard_Standard-critdice": values[critdice]
            });
        });
    }
});

on(
    "change:repeating_standard:standard-ability change:repeating_standard:standard-display",
    function (eventInfo) {
        getAttrs(["repeating_Standard_Standard-Ability"], function (values) {
            var modname = values["repeating_Standard_Standard-Ability"];
            getAttrs([modname], function (values) {
                setAttrs({
                    "repeating_Standard_Standard-abimod": parseInt(
                        values[modname]
                    )
                });
            });
        });
    }
);

on(
    "change:repeating_standard:standard-miscattackbonus change:repeating_standard:standard-abimod change:repeating_standard:standard-hitbonus-accessory change:repeating_standard:standard-display",
    function () {
        getAttrs(
            [
                "repeating_standard_Standard-MiscAttackBonus",
                "repeating_standard_Standard-abimod",
                "repeating_standard_Standard-HitBonus-accessory",
                "Quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(
                        values["repeating_standard_Standard-MiscAttackBonus"]
                    ) +
                    parseInt(values["repeating_standard_Standard-abimod"]) +
                    parseInt(
                        values["repeating_standard_Standard-HitBonus-accessory"]
                    ) +
                    parseInt(values["Quest"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_Standard_Standard-HitBonus": finalattr
                });
            }
        );
    }
);

on(
    "change:repeating_standard:standard-miscdamage change:repeating_standard:standard-abidamage change:repeating_standard:standard-abimod change:repeating_standard:standard-display",
    function () {
        getAttrs(
            [
                "repeating_Standard_Standard-miscdamage",
                "repeating_Standard_Standard-abidamage",
                "repeating_Standard_Standard-abimod",
                "Quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(values["repeating_Standard_Standard-abidamage"]) *
                    parseInt(values["repeating_Standard_Standard-abimod"]) +
                    parseInt(values["Quest"]) +
                    parseInt(values["repeating_Standard_Standard-miscdamage"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_Standard_Standard-flatdamage": finalattr
                });
            }
        );
    }
);

on("change:repeating_standard:standard-damagedice", function () {
    getAttrs(["repeating_Standard_Standard-damagedice"], function (values) {
        var numdice = parseInt(
            values["repeating_Standard_Standard-damagedice"]
        );
        var size = 4;
        if (numdice < 10) {
            size = parseInt(
                values["repeating_Standard_Standard-damagedice"].substring(2)
            );
        } else {
            size = parseInt(
                values["repeating_Standard_Standard-damagedice"].substring(3)
            );
        }
        var finalattr = numdice * size;
        setAttrs({
            "repeating_Standard_Standard-critflat": finalattr
        });
    });
});

/* ===MOVE=== */

on("change:repeating_move:move-accessory", function (eventInfo) {
    var accessory = eventInfo.newValue;
    var attack = accessory + "-prof";
    var damage = accessory + "-Damage";
    var brutal = accessory + "-Brutal";
    var brutN = accessory + "-BrutN";
    var crit = accessory + "-HighCrit";
    if (accessory.substring(0, 3) == "wep") {
        getAttrs(
            [attack, damage, brutal, brutN, crit, "level", "quest"],
            function (values) {
                var damagedice = values[damage];
                if (values[brutal] == "r<") {
                    damagedice = damagedice + values[brutal] + values[brutN];
                }
                var critdice = values["quest"] + "d6";
                if (values[crit] == "true") {
                    critdice =
                        critdice +
                        " + " +
                        parseInt(damagedice.substring(0, 1)) *
                        Math.ceil(parseInt(values["level"]) / 5) +
                        damagedice.substring(1);
                }
                setAttrs({
                    "repeating_Move_Move-HitBonus-accessory": parseInt(
                        values[attack]
                    ),
                    "repeating_Move_Move-damagedice": damagedice,
                    "repeating_Move_Move-critdice": critdice
                });
            }
        );
    } else {
        getAttrs([attack, damage, "quest"], function (values) {
            var critdice = values["quest"] + "d6";
            setAttrs({
                "repeating_Stanard_Move-HitBonus-accessory": parseInt(
                    values[attack]
                ),
                "repeating_Move_Move-damagedice": values[damage],
                "repeating_Move_Move-critdice": values[critdice]
            });
        });
    }
});

on(
    "change:repeating_move:move-ability change:repeating_move:move-display",
    function (eventInfo) {
        getAttrs(["repeating_Move_Move-Ability"], function (values) {
            var modname = values["repeating_Move_Move-Ability"];
            getAttrs([modname], function (values) {
                setAttrs({
                    "repeating_Move_Move-abimod": parseInt(values[modname])
                });
            });
        });
    }
);

on(
    "change:repeating_move:move-miscattackbonus change:repeating_move:move-abimod change:repeating_move:move-hitbonus-accessory change:repeating_move:move-display",
    function () {
        getAttrs(
            [
                "repeating_move_Move-MiscAttackBonus",
                "repeating_move_Move-abimod",
                "repeating_move_Move-HitBonus-accessory",
                "Quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(values["repeating_move_Move-MiscAttackBonus"]) +
                    parseInt(values["repeating_move_Move-abimod"]) +
                    parseInt(values["repeating_move_Move-HitBonus-accessory"]) +
                    parseInt(values["Quest"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_Move_Move-HitBonus": finalattr
                });
            }
        );
    }
);

on(
    "change:repeating_move:move-miscdamage change:repeating_move:move-abidamage change:repeating_move:move-abimod change:repeating_move:move-display",
    function () {
        getAttrs(
            [
                "repeating_Move_Move-miscdamage",
                "repeating_Move_Move-abidamage",
                "repeating_Move_Move-abimod",
                "Quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(values["repeating_Move_Move-abidamage"]) *
                    parseInt(values["repeating_Move_Move-abimod"]) +
                    parseInt(values["Quest"]) +
                    parseInt(values["repeating_Move_Move-miscdamage"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_Move_Move-flatdamage": finalattr
                });
            }
        );
    }
);

on("change:repeating_move:move-damagedice", function () {
    getAttrs(["repeating_Move_Move-damagedice"], function (values) {
        var numdice = parseInt(values["repeating_Move_Move-damagedice"]);
        var size = 4;
        if (numdice < 10) {
            size = parseInt(
                values["repeating_Move_Move-damagedice"].substring(2)
            );
        } else {
            size = parseInt(
                values["repeating_Move_Move-damagedice"].substring(3)
            );
        }
        var finalattr = numdice * size;
        setAttrs({
            "repeating_Move_Move-critflat": finalattr
        });
    });
});

on("change:repeating_minor:minor-accessory", function (eventInfo) {
    var accessory = eventInfo.newValue;
    var attack = accessory + "-prof";
    var damage = accessory + "-Damage";
    var brutal = accessory + "-Brutal";
    var brutN = accessory + "-BrutN";
    var crit = accessory + "-HighCrit";
    if (accessory.substring(0, 3) == "wep") {
        getAttrs(
            [attack, damage, brutal, brutN, crit, "level", "quest"],
            function (values) {
                var damagedice = values[damage];
                if (values[brutal] == "r<") {
                    damagedice = damagedice + values[brutal] + values[brutN];
                }
                var critdice = values["quest"] + "d6";
                if (values[crit] == "true") {
                    critdice =
                        critdice +
                        " + " +
                        parseInt(damagedice.substring(0, 1)) *
                        Math.ceil(parseInt(values["level"]) / 5) +
                        damagedice.substring(1);
                }
                setAttrs({
                    "repeating_Minor_Minor-HitBonus-accessory": parseInt(
                        values[attack]
                    ),
                    "repeating_Minor_Minor-damagedice": damagedice,
                    "repeating_Minor_Minor-critdice": critdice
                });
            }
        );
    } else {
        getAttrs([attack, damage, "quest"], function (values) {
            var critdice = values["quest"] + "d6";
            setAttrs({
                "repeating_Stanard_Minor-HitBonus-accessory": parseInt(
                    values[attack]
                ),
                "repeating_Minor_Minor-damagedice": values[damage],
                "repeating_Minor_Minor-critdice": values[critdice]
            });
        });
    }
});

/* ===MINOR=== */

on(
    "change:repeating_minor:minor-ability change:repeating_minor:minor-display",
    function (eventInfo) {
        getAttrs(["repeating_Minor_Minor-Ability"], function (values) {
            var modname = values["repeating_Minor_Minor-Ability"];
            getAttrs([modname], function (values) {
                setAttrs({
                    "repeating_Minor_Minor-abimod": parseInt(values[modname])
                });
            });
        });
    }
);

on(
    "change:repeating_minor:minor-miscattackbonus change:repeating_minor:minor-abimod change:repeating_minor:minor-hitbonus-accessory change:repeating_minor:minor-display",
    function () {
        getAttrs(
            [
                "repeating_minor_Minor-MiscAttackBonus",
                "repeating_minor_Minor-abimod",
                "repeating_minor_Minor-HitBonus-accessory",
                "Quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(values["repeating_minor_Minor-MiscAttackBonus"]) +
                    parseInt(values["repeating_minor_Minor-abimod"]) +
                    parseInt(
                        values["repeating_minor_Minor-HitBonus-accessory"]
                    ) +
                    parseInt(values["Quest"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_Minor_Minor-HitBonus": finalattr
                });
            }
        );
    }
);

on(
    "change:repeating_minor:minor-miscdamage change:repeating_minor:minor-abidamage change:repeating_minor:minor-abimod change:repeating_minor:minor-display",
    function () {
        getAttrs(
            [
                "repeating_Minor_Minor-miscdamage",
                "repeating_Minor_Minor-abidamage",
                "repeating_Minor_Minor-abimod",
                "Quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(values["repeating_Minor_Minor-abidamage"]) *
                    parseInt(values["repeating_Minor_Minor-abimod"]) +
                    parseInt(values["Quest"]) +
                    parseInt(values["repeating_Minor_Minor-miscdamage"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_Minor_Minor-flatdamage": finalattr
                });
            }
        );
    }
);

on("change:repeating_minor:minor-damagedice", function () {
    getAttrs(["repeating_Minor_Minor-damagedice"], function (values) {
        var numdice = parseInt(values["repeating_Minor_Minor-damagedice"]);
        var size = 4;
        if (numdice < 10) {
            size = parseInt(
                values["repeating_Minor_Minor-damagedice"].substring(2)
            );
        } else {
            size = parseInt(
                values["repeating_Minor_Minor-damagedice"].substring(3)
            );
        }
        var finalattr = numdice * size;
        setAttrs({
            "repeating_Minor_Minor-critflat": finalattr
        });
    });
});

/* ===REACTION=== */

on("change:repeating_reaction:reaction-accessory", function (eventInfo) {
    var accessory = eventInfo.newValue;
    var attack = accessory + "-prof";
    var damage = accessory + "-Damage";
    var brutal = accessory + "-Brutal";
    var brutN = accessory + "-BrutN";
    var crit = accessory + "-HighCrit";
    if (accessory.substring(0, 3) == "wep") {
        getAttrs(
            [attack, damage, brutal, brutN, crit, "level", "quest"],
            function (values) {
                var damagedice = values[damage];
                if (values[brutal] == "r<") {
                    damagedice = damagedice + values[brutal] + values[brutN];
                }
                var critdice = values["quest"] + "d6";
                if (values[crit] == "true") {
                    critdice =
                        critdice +
                        " + " +
                        parseInt(damagedice.substring(0, 1)) *
                        Math.ceil(parseInt(values["level"]) / 5) +
                        damagedice.substring(1);
                }
                setAttrs({
                    "repeating_Reaction_Reaction-HitBonus-accessory": parseInt(
                        values[attack]
                    ),
                    "repeating_Reaction_Reaction-damagedice": damagedice,
                    "repeating_Reaction_Reaction-critdice": critdice
                });
            }
        );
    } else {
        getAttrs([attack, damage, "quest"], function (values) {
            var critdice = values["quest"] + "d6";
            setAttrs({
                "repeating_Stanard_Reaction-HitBonus-accessory": parseInt(
                    values[attack]
                ),
                "repeating_Reaction_Reaction-damagedice": values[damage],
                "repeating_Reaction_Reaction-critdice": values[critdice]
            });
        });
    }
});

on(
    "change:repeating_reaction:reaction-ability change:repeating_reaction:reaction-display",
    function (eventInfo) {
        getAttrs(["repeating_Reaction_Reaction-Ability"], function (values) {
            var modname = values["repeating_Reaction_Reaction-Ability"];
            getAttrs([modname], function (values) {
                setAttrs({
                    "repeating_Reaction_Reaction-abimod": parseInt(
                        values[modname]
                    )
                });
            });
        });
    }
);

on(
    "change:repeating_reaction:reaction-miscattackbonus change:repeating_reaction:reaction-abimod change:repeating_reaction:reaction-hitbonus-accessory change:repeating_reaction:reaction-display",
    function () {
        getAttrs(
            [
                "repeating_reaction_Reaction-MiscAttackBonus",
                "repeating_reaction_Reaction-abimod",
                "repeating_reaction_Reaction-HitBonus-accessory",
                "Quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(
                        values["repeating_reaction_Reaction-MiscAttackBonus"]
                    ) +
                    parseInt(values["repeating_reaction_Reaction-abimod"]) +
                    parseInt(
                        values["repeating_reaction_Reaction-HitBonus-accessory"]
                    ) +
                    parseInt(values["Quest"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_Reaction_Reaction-HitBonus": finalattr
                });
            }
        );
    }
);

on(
    "change:repeating_reaction:reaction-miscdamage change:repeating_reaction:reaction-abidamage change:repeating_reaction:reaction-abimod change:repeating_reaction:reaction-display",
    function () {
        getAttrs(
            [
                "repeating_Reaction_Reaction-miscdamage",
                "repeating_Reaction_Reaction-abidamage",
                "repeating_Reaction_Reaction-abimod",
                "Quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(values["repeating_Reaction_Reaction-abidamage"]) *
                    parseInt(values["repeating_Reaction_Reaction-abimod"]) +
                    parseInt(values["Quest"]) +
                    parseInt(values["repeating_Reaction_Reaction-miscdamage"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_Reaction_Reaction-flatdamage": finalattr
                });
            }
        );
    }
);

on("change:repeating_reaction:reaction-damagedice", function () {
    getAttrs(["repeating_Reaction_Reaction-damagedice"], function (values) {
        var numdice = parseInt(
            values["repeating_Reaction_Reaction-damagedice"]
        );
        var size = 4;
        if (numdice < 10) {
            size = parseInt(
                values["repeating_Reaction_Reaction-damagedice"].substring(2)
            );
        } else {
            size = parseInt(
                values["repeating_Reaction_Reaction-damagedice"].substring(3)
            );
        }
        var finalattr = numdice * size;
        setAttrs({
            "repeating_Reaction_Reaction-critflat": finalattr
        });
    });
});

/********

SKILLS

********/

on(
    "change:acrobatics-train change:acrobatics-miscbonus change:dexmod change:quest",
    function () {
        getAttrs(
            ["Acrobatics-Train", "Acrobatics-MiscBonus", "dexmod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Acrobatics-Train"]) +
                    parseInt(values["Acrobatics-MiscBonus"]) +
                    parseInt(values["dexmod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Acrobatics: finalattr
                });
            }
        );
    }
);

on(
    "change:appeal-train change:appeal-miscbonus change:chamod change:quest",
    function () {
        getAttrs(
            ["Appeal-Train", "Appeal-MiscBonus", "chamod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Appeal-Train"]) +
                    parseInt(values["Appeal-MiscBonus"]) +
                    parseInt(values["chamod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Appeal: finalattr
                });
            }
        );
    }
);

on(
    "change:arcana-train change:arcana-miscbonus change:intmod change:quest",
    function () {
        getAttrs(
            ["Arcana-Train", "Arcana-MiscBonus", "intmod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Arcana-Train"]) +
                    parseInt(values["Arcana-MiscBonus"]) +
                    parseInt(values["intmod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Arcana: finalattr
                });
            }
        );
    }
);

on(
    "change:athletics-train change:athletics-miscbonus change:strmod change:quest",
    function () {
        getAttrs(
            ["Athletics-Train", "Athletics-MiscBonus", "strmod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Athletics-Train"]) +
                    parseInt(values["Athletics-MiscBonus"]) +
                    parseInt(values["strmod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Athletics: finalattr
                });
            }
        );
    }
);

on(
    "change:debate-train change:debate-miscbonus change:intmod change:quest",
    function () {
        getAttrs(
            ["Debate-Train", "Debate-MiscBonus", "intmod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Debate-Train"]) +
                    parseInt(values["Debate-MiscBonus"]) +
                    parseInt(values["intmod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Debate: finalattr
                });
            }
        );
    }
);

on(
    "change:endurance-train change:endurance-miscbonus change:conmod change:quest",
    function () {
        getAttrs(
            ["Endurance-Train", "Endurance-MiscBonus", "conmod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Endurance-Train"]) +
                    parseInt(values["Endurance-MiscBonus"]) +
                    parseInt(values["conmod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Endurance: finalattr
                });
            }
        );
    }
);

on(
    "change:handleanimal-train change:handleanimal-miscbonus change:wismod change:quest",
    function () {
        getAttrs(
            ["HandleAnimal-Train", "HandleAnimal-MiscBonus", "wismod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["HandleAnimal-Train"]) +
                    parseInt(values["HandleAnimal-MiscBonus"]) +
                    parseInt(values["wismod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    HandleAnimal: finalattr
                });
            }
        );
    }
);

on(
    "change:impress-train change:impress-miscbonus change:chamod change:quest",
    function () {
        getAttrs(
            ["Impress-Train", "Impress-MiscBonus", "chamod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Impress-Train"]) +
                    parseInt(values["Impress-MiscBonus"]) +
                    parseInt(values["chamod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Impress: finalattr
                });
            }
        );
    }
);

on(
    "change:insight-train change:insight-miscbonus change:wismod change:quest",
    function () {
        getAttrs(
            ["Insight-Train", "Insight-MiscBonus", "wismod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Insight-Train"]) +
                    parseInt(values["Insight-MiscBonus"]) +
                    parseInt(values["wismod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Insight: finalattr
                });
            }
        );
    }
);

on(
    "change:medicine-train change:medicine-miscbonus change:wismod change:quest",
    function () {
        getAttrs(
            ["Medicine-Train", "Medicine-MiscBonus", "wismod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Medicine-Train"]) +
                    parseInt(values["Medicine-MiscBonus"]) +
                    parseInt(values["wismod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Medicine: finalattr
                });
            }
        );
    }
);

on(
    "change:perception-train change:perception-miscbonus change:wismod change:quest",
    function () {
        getAttrs(
            ["Perception-Train", "Perception-MiscBonus", "wismod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Perception-Train"]) +
                    parseInt(values["Perception-MiscBonus"]) +
                    parseInt(values["wismod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Perception: finalattr
                });
            }
        );
    }
);

on(
    "change:repair-train change:repair-miscbonus change:intmod change:quest",
    function () {
        getAttrs(
            ["Repair-Train", "Repair-MiscBonus", "intmod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Repair-Train"]) +
                    parseInt(values["Repair-MiscBonus"]) +
                    parseInt(values["intmod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Repair: finalattr
                });
            }
        );
    }
);

on(
    "change:research-train change:research-miscbonus change:intmod change:quest",
    function () {
        getAttrs(
            ["Research-Train", "Research-MiscBonus", "intmod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Research-Train"]) +
                    parseInt(values["Research-MiscBonus"]) +
                    parseInt(values["intmod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Research: finalattr
                });
            }
        );
    }
);

on(
    "change:sleightofhand-train change:sleightofhand-miscbonus change:dexmod change:quest",
    function () {
        getAttrs(
            [
                "SleightofHand-Train",
                "SleightofHand-MiscBonus",
                "dexmod",
                "Quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(values["SleightofHand-Train"]) +
                    parseInt(values["SleightofHand-MiscBonus"]) +
                    parseInt(values["dexmod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    SleightofHand: finalattr
                });
            }
        );
    }
);

on(
    "change:stealth-train change:stealth-miscbonus change:dexmod change:quest",
    function () {
        getAttrs(
            ["Stealth-Train", "Stealth-MiscBonus", "dexmod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Stealth-Train"]) +
                    parseInt(values["Stealth-MiscBonus"]) +
                    parseInt(values["dexmod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Stealth: finalattr
                });
            }
        );
    }
);

on(
    "change:socialize-train change:socialize-miscbonus change:chamod change:quest",
    function () {
        getAttrs(
            ["Socialize-Train", "Socialize-MiscBonus", "chamod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Socialize-Train"]) +
                    parseInt(values["Socialize-MiscBonus"]) +
                    parseInt(values["chamod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Socialize: finalattr
                });
            }
        );
    }
);

on(
    "change:survival-train change:survival-miscbonus change:wismod change:quest",
    function () {
        getAttrs(
            ["Survival-Train", "Survival-MiscBonus", "wismod", "Quest"],
            function (values) {
                var finalattr =
                    parseInt(values["Survival-Train"]) +
                    parseInt(values["Survival-MiscBonus"]) +
                    parseInt(values["wismod"]) +
                    parseInt(values["Quest"]);
                if (finalattr > 0) {
                    finalattr = "+" + finalattr;
                }
                setAttrs({
                    Survival: finalattr
                });
            }
        );
    }
);

on("change:acrobatics-train", function () {
    getAttrs(["Acrobatics-Train"], function (values) {
        setAttrs({
            "Acrobatics-Trained": training(values["Acrobatics-Train"])
        });
    });
});

on("change:appeal-train", function () {
    getAttrs(["Appeal-Train"], function (values) {
        setAttrs({
            "Appeal-Trained": training(values["Appeal-Train"])
        });
    });
});

on("change:arcana-train", function () {
    getAttrs(["Arcana-Train"], function (values) {
        setAttrs({
            "Arcana-Trained": training(values["Arcana-Train"])
        });
    });
});

on("change:athletics-train", function () {
    getAttrs(["Athletics-Train"], function (values) {
        setAttrs({
            "Athletics-Trained": training(values["Athletics-Train"])
        });
    });
});

on("change:debate-train", function () {
    getAttrs(["Debate-Train"], function (values) {
        setAttrs({
            "Debate-Trained": training(values["Debate-Train"])
        });
    });
});

on("change:endurance-train", function () {
    getAttrs(["Endurance-Train"], function (values) {
        setAttrs({
            "Endurance-Trained": training(values["Endurance-Train"])
        });
    });
});

on("change:handleanimal-train", function () {
    getAttrs(["HandleAnimal-Train"], function (values) {
        setAttrs({
            "HandleAnimal-Trained": training(values["HandleAnimal-Train"])
        });
    });
});

on("change:impress-train", function () {
    getAttrs(["Impress-Train"], function (values) {
        setAttrs({
            "Impress-Trained": training(values["Impress-Train"])
        });
    });
});

on("change:insight-train", function () {
    getAttrs(["Insight-Train"], function (values) {
        setAttrs({
            "Insight-Trained": training(values["Insight-Train"])
        });
    });
});

on("change:medicine-train", function () {
    getAttrs(["Medicine-Train"], function (values) {
        setAttrs({
            "Medicine-Trained": training(values["Medicine-Train"])
        });
    });
});

on("change:perception-train", function () {
    getAttrs(["Perception-Train"], function (values) {
        setAttrs({
            "Perception-Trained": training(values["Perception-Train"])
        });
    });
});

on("change:repair-train", function () {
    getAttrs(["Repair-Train"], function (values) {
        setAttrs({
            "Repair-Trained": training(values["Repair-Train"])
        });
    });
});

on("change:research-train", function () {
    getAttrs(["Research-Train"], function (values) {
        setAttrs({
            "Research-Trained": training(values["Research-Train"])
        });
    });
});

on("change:sleightofhand-train", function () {
    getAttrs(["SleightofHand-Train"], function (values) {
        setAttrs({
            "SleightofHand-Trained": training(values["SleightofHand-Train"])
        });
    });
});

on("change:stealth-train", function () {
    getAttrs(["Stealth-Train"], function (values) {
        setAttrs({
            "Stealth-Trained": training(values["Stealth-Train"])
        });
    });
});

on("change:socialize-train", function () {
    getAttrs(["Socialize-Train"], function (values) {
        setAttrs({
            "Socialize-Trained": training(values["Socialize-Train"])
        });
    });
});

on("change:survival-train", function () {
    getAttrs(["Survival-Train"], function (values) {
        setAttrs({
            "Survival-Trained": training(values["Survival-Train"])
        });
    });
});

on("change:repeating_onpersonitems:onpersonitem-quantity change:repeating_onpersonitems:onpersonitem-space", function () {
    getSectionIDs("onpersonitems", function (idarray) {
        var totalSpace = 0;
        var quantArray = [];
        var sizeArray = [];
        for (var i = 0; i < idarray.length; i++) {
            quantArray.push("repeating_onpersonitems_" + idarray[i] + "_OnPersonItem-Quantity");
            sizeArray.push("repeating_onpersonitems_" + idarray[i] + "_OnPersonItem-Space");
        }
        getAttrs(quantArray.concat(sizeArray), function (values) {
            // console.log(values);
            for (i = 0; i < idarray.length; i++) {
                totalSpace += values[quantArray[i]] * values[sizeArray[i]];
            }
            // console.log(totalSpace);
            setAttrs({
                currentSpace: totalSpace
            })
        });
    });
});


/********

WEAPONS

********/

on(
    "change:wep1-ability change:wep2-ability change:wep3-ability change:strmod change:conmod change:dexmod change:intmod change:wismod change:chamod",
    function () {
        getAttrs(["wep1-Ability", "wep2-Ability", "wep3-Ability"], function (values) {
            var wep1mod = values["wep1-Ability"];
            var wep2mod = values["wep2-Ability"];
            var wep3mod = values["wep3-Ability"];
            getAttrs([wep1mod, wep2mod, wep3mod], function (values) {
                setAttrs({
                    "wep1-abimod": parseInt(
                        values[wep1mod]
                    ),
                    "wep2-abimod": parseInt(
                        values[wep2mod]
                    ),
                    "wep3-abimod": parseInt(
                        values[wep3mod]
                    ),
                });
            });
        });
    }
);

on("change:wep1-abimod change:wep1-prof", function () {
    getAttrs(["wep1-abimod", "wep1-prof"], function (v) {
        setAttrs({
            "wep1-HitBonus": parseInt(v["wep1-abimod"]) + parseInt(v["wep1-prof"])
        })
    })
});

on("change:wep1-damage change:wep1-damage-versatile change:wep1-versatile change:wep1-brutal change:wep1-brutaln change:wep1-highcrit", function () {
    getAttrs(["wep1-damage", "wep1-damage-versatile", "wep1-versatile", "wep1-brutal", "wep1-brutaln", "wep1-highcrit"], function (v) {
        var damagedice = v["wep1-damage"];
        if (v["wep1-versatile"]) {
            damagedice = v["wep1-damage-versatile"];
        }
        brutal = "";
        if (v["wep1-brutal"]) {
            brutal = v["wep1-brutal"] + v["wep1-brutaln"]
        }
        setAttrs({
            "wep1-DamageRoll": damagedice + brutal
        });
    });
});