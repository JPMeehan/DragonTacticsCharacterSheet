
    on("sheet:opened", function() {
        console.log("Sheet opened, JS is running");
    });

    on("change:hp_max", function() {
        getAttrs(["HP_max"], function(values) {
            setAttrs({
                "HP-Bloodied": Math.floor(values.HP_max / 2),
                "HP-surgeValue": Math.floor(values.HP_max / 4)
            });
        });
    });

    on("change:strength", function() {
        getAttrs(["Strength"], function(values) {
            setAttrs({
                strmod: Math.floor(values.Strength / 2 - 5)
            });
        });
    });

    on("change:constitution", function() {
        getAttrs(["Constitution"], function(values) {
            setAttrs({
                conmod: Math.floor(values.Constitution / 2 - 5)
            });
        });
    });

    on("change:dexterity", function() {
        getAttrs(["Dexterity"], function(values) {
            setAttrs({
                dexmod: Math.floor(values.Dexterity / 2 - 5)
            });
        });
    });

    on("change:intelligence", function() {
        getAttrs(["Intelligence"], function(values) {
            setAttrs({
                intmod: Math.floor(values.Intelligence / 2 - 5)
            });
        });
    });

    on("change:wisdom", function() {
        getAttrs(["Wisdom"], function(values) {
            setAttrs({
                wismod: Math.floor(values.Wisdom / 2 - 5)
            });
        });
    });

    on("change:charisma", function() {
        getAttrs(["Charisma"], function(values) {
            setAttrs({
                chamod: Math.floor(values.Charisma / 2 - 5)
            });
        });
    });

    on(
        "change:ac-att change:strmod change:conmod change:dexmod change:intmod change:wismod change:chamod  change:quest change:ac-armor change:ac-misc",
        function() {
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
                function(values) {
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

    on("change:strmod change:conmod change:quest change:fort-misc", function() {
        getAttrs(["strmod", "conmod", "Quest", "Fort-Misc"], function(values) {
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

    on("change:dexmod change:intmod change:quest change:ref-misc", function() {
        getAttrs(["dexmod", "intmod", "Quest", "Ref-Misc"], function(values) {
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

    on("change:wismod change:chamod change:quest change:will-misc", function() {
        getAttrs(["wismod", "chamod", "Quest", "Will-Misc"], function(values) {
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

    on("change:strikerdice", function() {
        getAttrs(["strikerdice"], function(values) {
            var numdice = parseInt(values.strikerdice);
            var size = 4;
            if (numdice < 10) {
                size = parseInt(values.strikerdice.substring(2));
            } else {
                size = parseInt(values.strikerdice.substring(3));
            }
            var finalattr = numdice * size;
            setAttrs({
                strikercrit: finalattr
            });
        });
    });

    on("change:repeating_standard:standard-accessory", function(eventInfo) {
        var accessory = eventInfo.newValue;
        var attack = accessory + "-Attack";
        var damage = accessory + "-Damage";
        var brutal = accessory + "-Brutal";
        var brutN = accessory + "-BrutN";
        var crit = accessory + "-HighCrit";
        if (accessory.substring(0, 3) == "wep") {
            getAttrs(
                [attack, damage, brutal, brutN, crit, "level", "quest"],
                function(values) {
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
            getAttrs([attack, damage, "quest"], function(values) {
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
        function(eventInfo) {
            getAttrs(["repeating_Standard_Standard-Ability"], function(values) {
                var modname = values["repeating_Standard_Standard-Ability"];
                getAttrs([modname], function(values) {
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
        function() {
            getAttrs(
                [
                    "repeating_standard_Standard-MiscAttackBonus",
                    "repeating_standard_Standard-abimod",
                    "repeating_standard_Standard-HitBonus-accessory",
                    "Quest"
                ],
                function(values) {
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
        "change:repeating_standard:standard-miscdamage change:repeating_standard:standard-abimod change:repeating_standard:standard-display",
        function() {
            getAttrs(
                [
                    "repeating_Standard_Standard-miscdamage",
                    "repeating_Standard_Standard-abimod",
                    "Quest"
                ],
                function(values) {
                    var finalattr =
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

    on("change:repeating_standard:standard-damagedice", function() {
        getAttrs(["repeating_Standard_Standard-damagedice"], function(values) {
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

    on("change:repeating_move:move-accessory", function(eventInfo) {
        var accessory = eventInfo.newValue;
        var attack = accessory + "-Attack";
        var damage = accessory + "-Damage";
        var brutal = accessory + "-Brutal";
        var brutN = accessory + "-BrutN";
        var crit = accessory + "-HighCrit";
        if (accessory.substring(0, 3) == "wep") {
            getAttrs(
                [attack, damage, brutal, brutN, crit, "level", "quest"],
                function(values) {
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
            getAttrs([attack, damage, "quest"], function(values) {
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
        function(eventInfo) {
            getAttrs(["repeating_Move_Move-Ability"], function(values) {
                var modname = values["repeating_Move_Move-Ability"];
                getAttrs([modname], function(values) {
                    setAttrs({
                        "repeating_Move_Move-abimod": parseInt(values[modname])
                    });
                });
            });
        }
    );

    on(
        "change:repeating_move:move-miscattackbonus change:repeating_move:move-abimod change:repeating_move:move-hitbonus-accessory change:repeating_move:move-display",
        function() {
            getAttrs(
                [
                    "repeating_move_Move-MiscAttackBonus",
                    "repeating_move_Move-abimod",
                    "repeating_move_Move-HitBonus-accessory",
                    "Quest"
                ],
                function(values) {
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
        "change:repeating_move:move-miscdamage change:repeating_move:move-abimod change:repeating_move:move-display",
        function() {
            getAttrs(
                [
                    "repeating_Move_Move-miscdamage",
                    "repeating_Move_Move-abimod",
                    "Quest"
                ],
                function(values) {
                    var finalattr =
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

    on("change:repeating_move:move-damagedice", function() {
        getAttrs(["repeating_Move_Move-damagedice"], function(values) {
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

    on("change:repeating_minor:minor-accessory", function(eventInfo) {
        var accessory = eventInfo.newValue;
        var attack = accessory + "-Attack";
        var damage = accessory + "-Damage";
        var brutal = accessory + "-Brutal";
        var brutN = accessory + "-BrutN";
        var crit = accessory + "-HighCrit";
        if (accessory.substring(0, 3) == "wep") {
            getAttrs(
                [attack, damage, brutal, brutN, crit, "level", "quest"],
                function(values) {
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
            getAttrs([attack, damage, "quest"], function(values) {
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

    on(
        "change:repeating_minor:minor-ability change:repeating_minor:minor-display",
        function(eventInfo) {
            getAttrs(["repeating_Minor_Minor-Ability"], function(values) {
                var modname = values["repeating_Minor_Minor-Ability"];
                getAttrs([modname], function(values) {
                    setAttrs({
                        "repeating_Minor_Minor-abimod": parseInt(values[modname])
                    });
                });
            });
        }
    );

    on(
        "change:repeating_minor:minor-miscattackbonus change:repeating_minor:minor-abimod change:repeating_minor:minor-hitbonus-accessory change:repeating_minor:minor-display",
        function() {
            getAttrs(
                [
                    "repeating_minor_Minor-MiscAttackBonus",
                    "repeating_minor_Minor-abimod",
                    "repeating_minor_Minor-HitBonus-accessory",
                    "Quest"
                ],
                function(values) {
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
        "change:repeating_minor:minor-miscdamage change:repeating_minor:minor-abimod change:repeating_minor:minor-display",
        function() {
            getAttrs(
                [
                    "repeating_Minor_Minor-miscdamage",
                    "repeating_Minor_Minor-abimod",
                    "Quest"
                ],
                function(values) {
                    var finalattr =
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

    on("change:repeating_minor:minor-damagedice", function() {
        getAttrs(["repeating_Minor_Minor-damagedice"], function(values) {
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

    on("change:repeating_reaction:reaction-accessory", function(eventInfo) {
        var accessory = eventInfo.newValue;
        var attack = accessory + "-Attack";
        var damage = accessory + "-Damage";
        var brutal = accessory + "-Brutal";
        var brutN = accessory + "-BrutN";
        var crit = accessory + "-HighCrit";
        if (accessory.substring(0, 3) == "wep") {
            getAttrs(
                [attack, damage, brutal, brutN, crit, "level", "quest"],
                function(values) {
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
            getAttrs([attack, damage, "quest"], function(values) {
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
        function(eventInfo) {
            getAttrs(["repeating_Reaction_Reaction-Ability"], function(values) {
                var modname = values["repeating_Reaction_Reaction-Ability"];
                getAttrs([modname], function(values) {
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
        function() {
            getAttrs(
                [
                    "repeating_reaction_Reaction-MiscAttackBonus",
                    "repeating_reaction_Reaction-abimod",
                    "repeating_reaction_Reaction-HitBonus-accessory",
                    "Quest"
                ],
                function(values) {
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
        "change:repeating_reaction:reaction-miscdamage change:repeating_reaction:reaction-abimod change:repeating_reaction:reaction-display",
        function() {
            getAttrs(
                [
                    "repeating_Reaction_Reaction-miscdamage",
                    "repeating_Reaction_Reaction-abimod",
                    "Quest"
                ],
                function(values) {
                    var finalattr =
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

    on("change:repeating_reaction:reaction-damagedice", function() {
        getAttrs(["repeating_Reaction_Reaction-damagedice"], function(values) {
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

    on(
        "change:acrobatics-train change:acrobatics-miscbonus change:dexmod change:quest sheet:opened",
        function() {
            getAttrs(
                ["Acrobatics-Train", "Acrobatics-MiscBonus", "dexmod", "Quest"],
                function(values) {
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
        "change:appeal-train change:appeal-miscbonus change:chamod change:quest sheet:opened",
        function() {
            getAttrs(
                ["Appeal-Train", "Appeal-MiscBonus", "chamod", "Quest"],
                function(values) {
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
        "change:arcana-train change:arcana-miscbonus change:intmod change:quest sheet:opened",
        function() {
            getAttrs(
                ["Arcana-Train", "Arcana-MiscBonus", "intmod", "Quest"],
                function(values) {
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
        "change:athletics-train change:athletics-miscbonus change:strmod change:quest sheet:opened",
        function() {
            getAttrs(
                ["Athletics-Train", "Athletics-MiscBonus", "strmod", "Quest"],
                function(values) {
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
        "change:debate-train change:debate-miscbonus change:intmod change:quest sheet:opened",
        function() {
            getAttrs(
                ["Debate-Train", "Debate-MiscBonus", "intmod", "Quest"],
                function(values) {
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
        "change:endurance-train change:endurance-miscbonus change:conmod change:quest sheet:opened",
        function() {
            getAttrs(
                ["Endurance-Train", "Endurance-MiscBonus", "conmod", "Quest"],
                function(values) {
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
        "change:handleanimal-train change:handleanimal-miscbonus change:wismod change:quest sheet:opened",
        function() {
            getAttrs(
                ["HandleAnimal-Train", "HandleAnimal-MiscBonus", "wismod", "Quest"],
                function(values) {
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
        "change:impress-train change:impress-miscbonus change:chamod change:quest sheet:opened sheet:opened",
        function() {
            getAttrs(
                ["Impress-Train", "Impress-MiscBonus", "chamod", "Quest"],
                function(values) {
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
        "change:insight-train change:insight-miscbonus change:wismod change:quest sheet:opened",
        function() {
            getAttrs(
                ["Insight-Train", "Insight-MiscBonus", "wismod", "Quest"],
                function(values) {
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
        "change:medicine-train change:medicine-miscbonus change:wismod change:quest sheet:opened",
        function() {
            getAttrs(
                ["Medicine-Train", "Medicine-MiscBonus", "wismod", "Quest"],
                function(values) {
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
        "change:perception-train change:perception-miscbonus change:wismod change:quest sheet:opened",
        function() {
            getAttrs(
                ["Perception-Train", "Perception-MiscBonus", "wismod", "Quest"],
                function(values) {
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
        "change:repair-train change:repair-miscbonus change:intmod change:quest sheet:opened",
        function() {
            getAttrs(
                ["Repair-Train", "Repair-MiscBonus", "intmod", "Quest"],
                function(values) {
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
        "change:research-train change:research-miscbonus change:intmod change:quest sheet:opened",
        function() {
            getAttrs(
                ["Research-Train", "Research-MiscBonus", "intmod", "Quest"],
                function(values) {
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
        "change:sleightofhand-train change:sleightofhand-miscbonus change:dexmod change:quest sheet:opened",
        function() {
            getAttrs(
                [
                    "SleightofHand-Train",
                    "SleightofHand-MiscBonus",
                    "dexmod",
                    "Quest"
                ],
                function(values) {
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
        "change:stealth-train change:stealth-miscbonus change:dexmod change:quest sheet:opened",
        function() {
            getAttrs(
                ["Stealth-Train", "Stealth-MiscBonus", "dexmod", "Quest"],
                function(values) {
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
        "change:socialize-train change:socialize-miscbonus change:chamod change:quest sheet:opened",
        function() {
            getAttrs(
                ["Socialize-Train", "Socialize-MiscBonus", "chamod", "Quest"],
                function(values) {
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
        "change:survival-train change:survival-miscbonus change:wismod change:quest sheet:opened",
        function() {
            getAttrs(
                ["Survival-Train", "Survival-MiscBonus", "wismod", "Quest"],
                function(values) {
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

    on("change:acrobatics-train sheet:opened", function() {
        getAttrs(["Acrobatics-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Acrobatics-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Acrobatics-Trained": finalattr
            });
        });
    });

    on("change:appeal-train sheet:opened", function() {
        getAttrs(["Appeal-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Appeal-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Appeal-Trained": finalattr
            });
        });
    });

    on("change:arcana-train sheet:opened", function() {
        getAttrs(["Arcana-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Arcana-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Arcana-Trained": finalattr
            });
        });
    });

    on("change:athletics-train sheet:opened", function() {
        getAttrs(["Athletics-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Athletics-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Athletics-Trained": finalattr
            });
        });
    });

    on("change:debate-train sheet:opened", function() {
        getAttrs(["Debate-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Debate-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Debate-Trained": finalattr
            });
        });
    });

    on("change:endurance-train sheet:opened", function() {
        getAttrs(["Endurance-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Endurance-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Endurance-Trained": finalattr
            });
        });
    });

    on("change:handleanimal-train sheet:opened", function() {
        getAttrs(["HandleAnimal-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["HandleAnimal-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "HandleAnimal-Trained": finalattr
            });
        });
    });

    on("change:impress-train sheet:opened", function() {
        getAttrs(["Impress-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Impress-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Impress-Trained": finalattr
            });
        });
    });
    on("change:insight-train sheet:opened", function() {
        getAttrs(["Insight-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Insight-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Insight-Trained": finalattr
            });
        });
    });

    on("change:medicine-train sheet:opened", function() {
        getAttrs(["Medicine-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Medicine-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Medicine-Trained": finalattr
            });
        });
    });

    on("change:perception-train sheet:opened", function() {
        getAttrs(["Perception-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Perception-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Perception-Trained": finalattr
            });
        });
    });

    on("change:repair-train sheet:opened", function() {
        getAttrs(["Repair-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Repair-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Repair-Trained": finalattr
            });
        });
    });

    on("change:research-train sheet:opened", function() {
        getAttrs(["Research-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Research-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Research-Trained": finalattr
            });
        });
    });

    on("change:sleightofhand-train sheet:opened", function() {
        getAttrs(["SleightofHand-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["SleightofHand-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "SleightofHand-Trained": finalattr
            });
        });
    });

    on("change:stealth-train sheet:opened", function() {
        getAttrs(["Stealth-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Stealth-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Stealth-Trained": finalattr
            });
        });
    });

    on("change:socialize-train sheet:opened", function() {
        getAttrs(["Socialize-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Socialize-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Socialize-Trained": finalattr
            });
        });
    });

    on("change:survival-train sheet:opened", function() {
        getAttrs(["Survival-Train"], function(values) {
            var finalattr = "Untrained";
            var skill = values["Survival-Train"];
            if (skill == 2) {
                finalattr = "Adept";
            } else if (skill == 4) {
                finalattr = "Trained";
            } else if (skill == 6) {
                finalattr = "Experienced";
            } else if (skill == 8) {
                finalattr = "Expert";
            } else if (skill == 10) {
                finalattr = "Master";
            }
            setAttrs({
                "Survival-Trained": finalattr
            });
        });
    });