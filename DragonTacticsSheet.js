

on("sheet:opened", function () {
    console.log("Sheet opened, JS is running");
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

on("change:constitution change:hp-base change:hp-level change:hp-bonus change:level", function() {
    getAttrs(["constitution", "hp-base", "hp-level", "hp-bonus", "level"], function(values) {
        hp_max = parseInt(values["constitution"]) + parseInt(values["hp-base"]) + parseInt(values["hp-level"]) * (parseInt(values["level"])-1) + parseInt(values["hp-bonus"])
        setAttrs({
            "hp_max": hp_max,
            "hp-bloodied": Math.floor(hp_max / 2),
            "hp-surgevalue": Math.floor(hp_max / 4)
        })
    })
})

on("change:strength", function () {
    getAttrs(["strength"], function (values) {
        setAttrs({
            strmod: Math.floor(values.strength / 2 - 5)
        });
    });
});

on("change:constitution", function () {
    getAttrs(["constitution"], function (values) {
        setAttrs({
            conmod: Math.floor(values.constitution / 2 - 5)
        });
    });
});

on("change:dexterity", function () {
    getAttrs(["dexterity"], function (values) {
        setAttrs({
            dexmod: Math.floor(values.dexterity / 2 - 5)
        });
    });
});

on("change:intelligence", function () {
    getAttrs(["intelligence"], function (values) {
        setAttrs({
            intmod: Math.floor(values.intelligence / 2 - 5)
        });
    });
});

on("change:wisdom", function () {
    getAttrs(["wisdom"], function (values) {
        setAttrs({
            wismod: Math.floor(values.wisdom / 2 - 5)
        });
    });
});

on("change:charisma", function () {
    getAttrs(["charisma"], function (values) {
        setAttrs({
            chamod: Math.floor(values.charisma / 2 - 5)
        });
    });
});

on("change:skilldisplay change:strmod change:conmod change:dexmod change:intmod change:wismod change:chamod change:quest", function() {
    getAttrs(["skilldisplay", "strmod", "conmod", "dexmod", "intmod", "wismod", "chamod", "quest"], function(values) {
        var abimod = parseInt(values["quest"]);
        switch (values["skilldisplay"]) {
            case "Strength":
                abimod += parseInt(values["strmod"]);
                break;
            case "Constitution":
                abimod += parseInt(values["conmod"]);
                break;
            case "Dexterity":
                abimod += parseInt(values["dexmod"]);
                break;
            case "Intelligence":
                abimod += parseInt(values["intmod"]);
                break;
            case "Wisdom":
                abimod += parseInt(values["wismod"]);
                break;
            case "Charisma":
                abimod += parseInt(values["chamod"]);
                break;
        }
        if (abimod >= 0) {abimod = "+" + String(abimod)}
        setAttrs({
            "abimod": abimod
        })
    })
})

/********

DEFENSES

********/

on(
    "change:ac-att change:strmod change:conmod change:dexmod change:intmod change:wismod change:chamod  change:quest change:ac-armor change:shield change:ac-misc",
    function () {
        getAttrs(
            [
                "ac-att",
                "strmod",
                "conmod",
                "dexmod",
                "intmod",
                "wismod",
                "chamod",
                "quest",
                "ac-armor",
                "shield",
                "ac-misc"
            ],
            function (values) {
                var abimod = 0;
                switch (parseInt(values["ac-att"])) {
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
                    parseInt(values.quest) +
                    parseInt(values["ac-armor"]) + 
                    parseInt(values["shield"]) +
                    parseInt(values["ac-misc"]);
                setAttrs({
                    AC: finalattr
                });
            }
        );
    }
);

on("change:strmod change:conmod change:quest change:fort-misc", function () {
    getAttrs(["strmod", "conmod", "quest", "fort-misc"], function (values) {
        var finalattr =
            10 +
            Math.max(parseInt(values.strmod), parseInt(values.conmod)) +
            parseInt(values.quest) +
            parseInt(values["fort-misc"]);
        setAttrs({
            "fort": finalattr
        });
    });
});

on("change:dexmod change:intmod change:shield change:quest change:ref-misc", function () {
    getAttrs(["dexmod", "intmod", "quest", "ref-misc", "shield"], function (values) {
        var finalattr =
            10 +
            Math.max(parseInt(values.dexmod), parseInt(values.intmod)) +
            parseInt(values.quest) +
            parseInt(values["shield"]) +
            parseInt(values["ref-misc"]);
        setAttrs({
            "ref": finalattr
        });
    });
});

on("change:wismod change:chamod change:quest change:will-misc", function () {
    getAttrs(["wismod", "chamod", "quest", "will-misc"], function (values) {
        var finalattr =
            10 +
            Math.max(parseInt(values.wismod), parseInt(values.chamod)) +
            parseInt(values.quest) +
            parseInt(values["will-misc"]);
        setAttrs({
            "will": finalattr
        });
    });
});

/********

ATTACKS

********/

on("change:bonusdice-entry", function () {
    getAttrs(["bonusdice-entry"], function (values) {
        setAttrs({
            'bonusdice-crit': maxdice(values["bonusdice-entry"])
        });
    });
});


/* ===STANDARD=== */

on("change:repeating_standard:standard-accessory", function (eventInfo) {
    var accessory = eventInfo.newValue;
    var attack = accessory + "-prof";
    var damageroll = accessory + "-damageroll";
    var crit = accessory + "-critdmg";
    if (accessory.substring(0, 3) == "wep") {
        getAttrs(
            [attack, damageroll, crit],
            function (values) {
                setAttrs({
                    "repeating_standard_standard-hitbonus-accessory": parseInt(
                        values[attack]
                    ),
                    "repeating_standard_standard-damagedice": values[damageroll],
                    "repeating_standard_standard-critdice": values[crit]
                });
            }
        );
    } else {
        getAttrs([attack, "quest"], function (values) {
            var critdice = values["quest"] + "d6";
            setAttrs({
                "repeating_stanard_standard-hitbonus-accessory": parseInt(
                    values[attack]
                ),
                "repeating_standard_standard-critdice": values[critdice]
            });
        });
    }
});

on(
    "change:repeating_standard:standard-ability change:repeating_standard:standard-display",
    function () {
        getAttrs(["repeating_standard_standard-ability"], function (values) {
            var modname = values["repeating_standard_standard-ability"];
            getAttrs([modname], function (values) {
                setAttrs({
                    "repeating_standard_standard-abimod": parseInt(
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
                "repeating_standard_standard-miscattackbonus",
                "repeating_standard_standard-abimod",
                "repeating_standard_standard-hitbonus-accessory",
                "quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(
                        values["repeating_standard_standard-miscattackbonus"]
                    ) +
                    parseInt(values["repeating_standard_standard-abimod"]) +
                    parseInt(
                        values["repeating_standard_standard-hitbonus-accessory"]
                    ) +
                    parseInt(values["quest"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_standard_standard-hitbonus": finalattr
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
                "repeating_standard_standard-miscdamage",
                "repeating_standard_standard-abidamage",
                "repeating_standard_standard-abimod",
                "quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(values["repeating_standard_standard-abidamage"]) *
                    parseInt(values["repeating_standard_standard-abimod"]) +
                    parseInt(values["quest"]) +
                    parseInt(values["repeating_standard_standard-miscdamage"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_standard_standard-flatdamage": finalattr
                });
            }
        );
    }
);

on("change:repeating_standard:standard-damagedice", function () {
    getAttrs(["repeating_standard_standard-damagedice"], function (values) {
        setAttrs({
            "repeating_standard_standard-critflat": maxdice(values["repeating_standard_standard-damagedice"])
        });
    });
});

/* ===MOVE=== */

on("change:repeating_move:move-accessory", function (eventInfo) {
    var accessory = eventInfo.newValue;
    var attack = accessory + "-prof";
    var damageroll = accessory + "-damageroll";
    var crit = accessory + "-critdmg";
    if (accessory.substring(0, 3) == "wep") {
        getAttrs(
            [attack, damageroll, crit],
            function (values) {
                setAttrs({
                    "repeating_move_move-hitbonus-accessory": parseInt(
                        values[attack]
                    ),
                    "repeating_move_move-damagedice": values[damageroll],
                    "repeating_move_move-critdice": values[crit]
                });
            }
        );
    } else {
        getAttrs([attack, "quest"], function (values) {
            var critdice = values["quest"] + "d6";
            setAttrs({
                "repeating_stanard_move-hitbonus-accessory": parseInt(
                    values[attack]
                ),
                "repeating_move_move-critdice": values[critdice]
            });
        });
    }
});

on(
    "change:repeating_move:move-ability change:repeating_move:move-display",
    function () {
        getAttrs(["repeating_move_move-ability"], function (values) {
            var modname = values["repeating_move_move-ability"];
            getAttrs([modname], function (values) {
                setAttrs({
                    "repeating_move_move-abimod": parseInt(
                        values[modname]
                    )
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
                "repeating_move_move-miscattackbonus",
                "repeating_move_move-abimod",
                "repeating_move_move-hitbonus-accessory",
                "quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(
                        values["repeating_move_move-miscattackbonus"]
                    ) +
                    parseInt(values["repeating_move_move-abimod"]) +
                    parseInt(
                        values["repeating_move_move-hitbonus-accessory"]
                    ) +
                    parseInt(values["quest"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_move_move-hitbonus": finalattr
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
                "repeating_move_move-miscdamage",
                "repeating_move_move-abidamage",
                "repeating_move_move-abimod",
                "quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(values["repeating_move_move-abidamage"]) *
                    parseInt(values["repeating_move_move-abimod"]) +
                    parseInt(values["quest"]) +
                    parseInt(values["repeating_move_move-miscdamage"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_move_move-flatdamage": finalattr
                });
            }
        );
    }
);

on("change:repeating_move:move-damagedice", function () {
    getAttrs(["repeating_move_move-damagedice"], function (values) {
        setAttrs({
            "repeating_move_move-critflat": maxdice(values["repeating_move_move-damagedice"])
        });
    });
});

/* ===MINOR=== */

on("change:repeating_minor:minor-accessory", function (eventInfo) {
    var accessory = eventInfo.newValue;
    var attack = accessory + "-prof";
    var damageroll = accessory + "-damageroll";
    var crit = accessory + "-critdmg";
    if (accessory.substring(0, 3) == "wep") {
        getAttrs(
            [attack, damageroll, crit],
            function (values) {
                setAttrs({
                    "repeating_minor_minor-hitbonus-accessory": parseInt(
                        values[attack]
                    ),
                    "repeating_minor_minor-damagedice": values[damageroll],
                    "repeating_minor_minor-critdice": values[crit]
                });
            }
        );
    } else {
        getAttrs([attack, "quest"], function (values) {
            var critdice = values["quest"] + "d6";
            setAttrs({
                "repeating_stanard_minor-hitbonus-accessory": parseInt(
                    values[attack]
                ),
                "repeating_minor_minor-critdice": values[critdice]
            });
        });
    }
});

on(
    "change:repeating_minor:minor-ability change:repeating_minor:minor-display",
    function () {
        getAttrs(["repeating_minor_minor-ability"], function (values) {
            var modname = values["repeating_minor_minor-ability"];
            getAttrs([modname], function (values) {
                setAttrs({
                    "repeating_minor_minor-abimod": parseInt(
                        values[modname]
                    )
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
                "repeating_minor_minor-miscattackbonus",
                "repeating_minor_minor-abimod",
                "repeating_minor_minor-hitbonus-accessory",
                "quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(
                        values["repeating_minor_minor-miscattackbonus"]
                    ) +
                    parseInt(values["repeating_minor_minor-abimod"]) +
                    parseInt(
                        values["repeating_minor_minor-hitbonus-accessory"]
                    ) +
                    parseInt(values["quest"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_minor_minor-hitbonus": finalattr
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
                "repeating_minor_minor-miscdamage",
                "repeating_minor_minor-abidamage",
                "repeating_minor_minor-abimod",
                "quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(values["repeating_minor_minor-abidamage"]) *
                    parseInt(values["repeating_minor_minor-abimod"]) +
                    parseInt(values["quest"]) +
                    parseInt(values["repeating_minor_minor-miscdamage"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_minor_minor-flatdamage": finalattr
                });
            }
        );
    }
);

on("change:repeating_minor:minor-damagedice", function () {
    getAttrs(["repeating_minor_minor-damagedice"], function (values) {
        setAttrs({
            "repeating_minor_minor-critflat": maxdice(values["repeating_minor_minor-damagedice"])
        });
    });
});

/* ===REACTION=== */

on("change:repeating_reaction:reaction-accessory", function (eventInfo) {
    var accessory = eventInfo.newValue;
    var attack = accessory + "-prof";
    var damageroll = accessory + "-damageroll";
    var crit = accessory + "-critdmg";
    if (accessory.substring(0, 3) == "wep") {
        getAttrs(
            [attack, damageroll, crit],
            function (values) {
                setAttrs({
                    "repeating_reaction_reaction-hitbonus-accessory": parseInt(
                        values[attack]
                    ),
                    "repeating_reaction_reaction-damagedice": values[damageroll],
                    "repeating_reaction_reaction-critdice": values[crit]
                });
            }
        );
    } else {
        getAttrs([attack, "quest"], function (values) {
            var critdice = values["quest"] + "d6";
            setAttrs({
                "repeating_stanard_reaction-hitbonus-accessory": parseInt(
                    values[attack]
                ),
                "repeating_reaction_reaction-critdice": values[critdice]
            });
        });
    }
});

on(
    "change:repeating_reaction:reaction-ability change:repeating_reaction:reaction-display",
    function () {
        getAttrs(["repeating_reaction_reaction-ability"], function (values) {
            var modname = values["repeating_reaction_reaction-ability"];
            getAttrs([modname], function (values) {
                setAttrs({
                    "repeating_reaction_reaction-abimod": parseInt(
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
                "repeating_reaction_reaction-miscattackbonus",
                "repeating_reaction_reaction-abimod",
                "repeating_reaction_reaction-hitbonus-accessory",
                "quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(
                        values["repeating_reaction_reaction-miscattackbonus"]
                    ) +
                    parseInt(values["repeating_reaction_reaction-abimod"]) +
                    parseInt(
                        values["repeating_reaction_reaction-hitbonus-accessory"]
                    ) +
                    parseInt(values["quest"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_reaction_reaction-hitbonus": finalattr
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
                "repeating_reaction_reaction-miscdamage",
                "repeating_reaction_reaction-abidamage",
                "repeating_reaction_reaction-abimod",
                "quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(values["repeating_reaction_reaction-abidamage"]) *
                    parseInt(values["repeating_reaction_reaction-abimod"]) +
                    parseInt(values["quest"]) +
                    parseInt(values["repeating_reaction_reaction-miscdamage"]);
                if (finalattr >= 0) {
                    finalattr = "+" + finalattr;
                } else {
                    finalattr = "-" + finalattr;
                }
                setAttrs({
                    "repeating_reaction_reaction-flatdamage": finalattr
                });
            }
        );
    }
);

on("change:repeating_reaction:reaction-damagedice", function () {
    getAttrs(["repeating_reaction_reaction-damagedice"], function (values) {
        setAttrs({
            "repeating_reaction_reaction-critflat": maxdice(values["repeating_reaction_reaction-damagedice"])
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
            ["acrobatics-train", "acrobatics-miscbonus", "dexmod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["acrobatics-train"]) +
                    parseInt(values["acrobatics-miscbonus"]) +
                    parseInt(values["dexmod"]) +
                    parseInt(values["quest"]);
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
            ["appeal-train", "appeal-miscbonus", "chamod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["appeal-train"]) +
                    parseInt(values["appeal-miscbonus"]) +
                    parseInt(values["chamod"]) +
                    parseInt(values["quest"]);
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
            ["arcana-train", "arcana-miscbonus", "intmod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["arcana-train"]) +
                    parseInt(values["arcana-miscbonus"]) +
                    parseInt(values["intmod"]) +
                    parseInt(values["quest"]);
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
            ["athletics-train", "athletics-miscbonus", "strmod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["athletics-train"]) +
                    parseInt(values["athletics-miscbonus"]) +
                    parseInt(values["strmod"]) +
                    parseInt(values["quest"]);
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
            ["debate-train", "debate-miscbonus", "intmod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["debate-train"]) +
                    parseInt(values["debate-miscbonus"]) +
                    parseInt(values["intmod"]) +
                    parseInt(values["quest"]);
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
            ["endurance-train", "endurance-miscbonus", "conmod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["endurance-train"]) +
                    parseInt(values["endurance-miscbonus"]) +
                    parseInt(values["conmod"]) +
                    parseInt(values["quest"]);
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
            ["handleanimal-train", "handleanimal-miscbonus", "wismod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["handleanimal-train"]) +
                    parseInt(values["handleanimal-miscbonus"]) +
                    parseInt(values["wismod"]) +
                    parseInt(values["quest"]);
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
            ["impress-train", "impress-miscbonus", "chamod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["impress-train"]) +
                    parseInt(values["impress-miscbonus"]) +
                    parseInt(values["chamod"]) +
                    parseInt(values["quest"]);
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
            ["insight-train", "insight-miscbonus", "wismod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["insight-train"]) +
                    parseInt(values["insight-miscbonus"]) +
                    parseInt(values["wismod"]) +
                    parseInt(values["quest"]);
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
            ["medicine-train", "medicine-miscbonus", "wismod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["medicine-train"]) +
                    parseInt(values["medicine-miscbonus"]) +
                    parseInt(values["wismod"]) +
                    parseInt(values["quest"]);
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
            ["perception-train", "perception-miscbonus", "wismod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["perception-train"]) +
                    parseInt(values["perception-miscbonus"]) +
                    parseInt(values["wismod"]) +
                    parseInt(values["quest"]);
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
            ["repair-train", "repair-miscbonus", "intmod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["repair-train"]) +
                    parseInt(values["repair-miscbonus"]) +
                    parseInt(values["intmod"]) +
                    parseInt(values["quest"]);
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
            ["research-train", "research-miscbonus", "intmod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["research-train"]) +
                    parseInt(values["research-miscbonus"]) +
                    parseInt(values["intmod"]) +
                    parseInt(values["quest"]);
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
                "sleightofhand-train",
                "sleightofhand-miscbonus",
                "dexmod",
                "quest"
            ],
            function (values) {
                var finalattr =
                    parseInt(values["sleightofhand-train"]) +
                    parseInt(values["sleightofhand-miscbonus"]) +
                    parseInt(values["dexmod"]) +
                    parseInt(values["quest"]);
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
            ["stealth-train", "stealth-miscbonus", "dexmod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["stealth-train"]) +
                    parseInt(values["stealth-miscbonus"]) +
                    parseInt(values["dexmod"]) +
                    parseInt(values["quest"]);
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
            ["socialize-train", "socialize-miscbonus", "chamod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["socialize-train"]) +
                    parseInt(values["socialize-miscbonus"]) +
                    parseInt(values["chamod"]) +
                    parseInt(values["quest"]);
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
            ["survival-train", "survival-miscbonus", "wismod", "quest"],
            function (values) {
                var finalattr =
                    parseInt(values["survival-train"]) +
                    parseInt(values["survival-miscbonus"]) +
                    parseInt(values["wismod"]) +
                    parseInt(values["quest"]);
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
    getAttrs(["acrobatics-train"], function (values) {
        setAttrs({
            "acrobatics-trained": training(values["acrobatics-train"])
        });
    });
});

on("change:appeal-train", function () {
    getAttrs(["appeal-train"], function (values) {
        setAttrs({
            "appeal-trained": training(values["appeal-train"])
        });
    });
});

on("change:arcana-train", function () {
    getAttrs(["arcana-train"], function (values) {
        setAttrs({
            "arcana-trained": training(values["arcana-train"])
        });
    });
});

on("change:athletics-train", function () {
    getAttrs(["athletics-train"], function (values) {
        setAttrs({
            "athletics-trained": training(values["athletics-train"])
        });
    });
});

on("change:debate-train", function () {
    getAttrs(["debate-train"], function (values) {
        setAttrs({
            "debate-trained": training(values["debate-train"])
        });
    });
});

on("change:endurance-train", function () {
    getAttrs(["endurance-train"], function (values) {
        setAttrs({
            "endurance-trained": training(values["endurance-train"])
        });
    });
});

on("change:handleanimal-train", function () {
    getAttrs(["handleanimal-train"], function (values) {
        setAttrs({
            "handleanimal-trained": training(values["handleanimal-train"])
        });
    });
});

on("change:impress-train", function () {
    getAttrs(["impress-train"], function (values) {
        setAttrs({
            "impress-trained": training(values["impress-train"])
        });
    });
});

on("change:insight-train", function () {
    getAttrs(["insight-train"], function (values) {
        setAttrs({
            "insight-trained": training(values["insight-train"])
        });
    });
});

on("change:medicine-train", function () {
    getAttrs(["medicine-train"], function (values) {
        setAttrs({
            "medicine-trained": training(values["medicine-train"])
        });
    });
});

on("change:perception-train", function () {
    getAttrs(["perception-train"], function (values) {
        setAttrs({
            "perception-trained": training(values["perception-train"])
        });
    });
});

on("change:repair-train", function () {
    getAttrs(["repair-train"], function (values) {
        setAttrs({
            "repair-trained": training(values["repair-train"])
        });
    });
});

on("change:research-train", function () {
    getAttrs(["research-train"], function (values) {
        setAttrs({
            "research-trained": training(values["research-train"])
        });
    });
});

on("change:sleightofhand-train", function () {
    getAttrs(["sleightofhand-train"], function (values) {
        setAttrs({
            "sleightofhand-trained": training(values["sleightofhand-train"])
        });
    });
});

on("change:stealth-train", function () {
    getAttrs(["stealth-train"], function (values) {
        setAttrs({
            "stealth-trained": training(values["stealth-train"])
        });
    });
});

on("change:socialize-train", function () {
    getAttrs(["socialize-train"], function (values) {
        setAttrs({
            "socialize-trained": training(values["socialize-train"])
        });
    });
});

on("change:survival-train", function () {
    getAttrs(["survival-train"], function (values) {
        setAttrs({
            "survival-trained": training(values["survival-train"])
        });
    });
});

on("change:repeating_onpersonitems:onpersonitem-quantity change:repeating_onpersonitems:onpersonitem-space", function () {
    getSectionIDs("onpersonitems", function (idarray) {
        var totalSpace = 0;
        var quantArray = [];
        var sizeArray = [];
        for (var i = 0; i < idarray.length; i++) {
            quantArray.push("repeating_onpersonitems_" + idarray[i] + "_onpersonitem-quantity");
            sizeArray.push("repeating_onpersonitems_" + idarray[i] + "_onpersonitem-space");
        }
        getAttrs(quantArray.concat(sizeArray), function (values) {
            for (i = 0; i < idarray.length; i++) {
                totalSpace += values[quantarray[i]] * values[sizearray[i]];
            }
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
        getAttrs(["wep1-ability", "wep2-ability", "wep3-ability"], function (values) {
            var wep1mod = values["wep1-ability"];
            var wep2mod = values["wep2-ability"];
            var wep3mod = values["wep3-ability"];
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

on("change:wep1-abimod change:wep1-prof change:quest", function () {
    getAttrs(["wep1-abimod", "wep1-prof", "quest"], function (v) {
        setAttrs({
            "wep1-hitbonus": parseInt(v["wep1-abimod"]) + parseInt(v["wep1-prof"]) + parseInt(v["quest"]),
            "wep1-damageflat": parseInt(v["wep1-abimod"]) + parseInt(v["quest"])
        })
    })
});

on("change:wep1-damage change:wep1-damage-versatile change:wep1-versatile change:wep1-brutal change:wep1-brutn change:wep1-highcrit change:wep1-damageflat change:level", function () {
    getAttrs(["wep1-damage", "wep1-damage-versatile", "wep1-versatile", "wep1-brutal", "wep1-brutn", "wep1-highcrit", "wep1-damageflat", "level", "quest"], function (v) {
        var damagedice = v["wep1-damage"];
        numdice = parseInt(damagedice);
        diesize = "d" + String(maxdice(damagedice) / numdice)
        if (v["wep1-versatile"] == 1) {
            damagedice = v["wep1-damage-versatile"];
        }
        brutal = "";
        if (v["wep1-brutal"] == "r<") {
            brutal = v["wep1-brutal"] + v["wep1-brutn"]
        }
        highcrit = ""
        if (v["wep1-highcrit"] == "true") {
            numdice = parseInt(damagedice);
            highcrit = String(Math.ceil(v["level"] / 5) * numdice) + diesize + " + ";
        }
        damagedice = String(Math.ceil(v["level"] / 10) * numdice) + diesize
        setAttrs({
            "wep1-damageroll": damagedice + brutal,
            "wep1-critdmg": highcrit + v["quest"] + "d6 + " + String(maxdice(damagedice) + v["wep1-damageflat"])
        });
    });
});



on("change:wep2-abimod change:wep2-prof change:quest", function () {
    getAttrs(["wep2-abimod", "wep2-prof", "quest"], function (v) {
        setAttrs({
            "wep2-hitbonus": parseInt(v["wep2-abimod"]) + parseInt(v["wep2-prof"]) + parseInt(v["quest"]),
            "wep2-damageflat": parseInt(v["wep2-abimod"]) + parseInt(v["quest"])
        })
    })
});

on("change:wep2-damage change:wep2-damage-versatile change:wep2-versatile change:wep2-brutal change:wep2-brutn change:wep2-highcrit change:wep2-damageflat change:level", function () {
    getAttrs(["wep2-damage", "wep2-damage-versatile", "wep2-versatile", "wep2-brutal", "wep2-brutn", "wep2-highcrit", "wep2-damageflat", "level", "quest"], function (v) {
        var damagedice = v["wep2-damage"];
        numdice = parseInt(damagedice);
        diesize = "d" + String(maxdice(damagedice) / numdice)
        if (v["wep2-versatile"] == 1) {
            damagedice = v["wep2-damage-versatile"];
        }
        brutal = "";
        if (v["wep2-brutal"] == "r<") {
            brutal = v["wep2-brutal"] + v["wep2-brutn"]
        }
        highcrit = ""
        if (v["wep2-highcrit"] == "true") {
            numdice = parseInt(damagedice);
            highcrit = String(Math.ceil(v["level"] / 5) * numdice) + diesize + " + ";
        }
        damagedice = String(Math.ceil(v["level"] / 10) * numdice) + diesize
        setAttrs({
            "wep2-damageroll": damagedice + brutal,
            "wep2-critdmg": highcrit + v["quest"] + "d6 + " + String(maxdice(damagedice) + v["wep2-damageflat"])
        });
    });
});


on("change:wep3-abimod change:wep3-prof change:quest", function () {
    getAttrs(["wep3-abimod", "wep3-prof", "quest"], function (v) {
        setAttrs({
            "wep3-hitbonus": parseInt(v["wep3-abimod"]) + parseInt(v["wep3-prof"]) + parseInt(v["quest"]),
            "wep3-damageflat": parseInt(v["wep3-abimod"]) + parseInt(v["quest"])
        })
    })
});

on("change:wep3-damage change:wep3-damage-versatile change:wep3-versatile change:wep3-brutal change:wep3-brutn change:wep3-highcrit change:wep3-damageflat change:level", function () {
    getAttrs(["wep3-damage", "wep3-damage-versatile", "wep3-versatile", "wep3-brutal", "wep3-brutn", "wep3-highcrit", "wep3-damageflat", "level", "quest"], function (v) {
        var damagedice = v["wep3-damage"];
        numdice = parseInt(damagedice);
        diesize = "d" + String(maxdice(damagedice) / numdice)
        if (v["wep3-versatile"] == 1) {
            damagedice = v["wep3-damage-versatile"];
        }
        brutal = "";
        if (v["wep3-brutal"] == "r<") {
            brutal = v["wep3-brutal"] + v["wep3-brutn"]
        }
        highcrit = ""
        if (v["wep3-highcrit"] == "true") {
            numdice = parseInt(damagedice);
            highcrit = String(Math.ceil(v["level"] / 5) * numdice) + diesize + " + ";
        }
        damagedice = String(Math.ceil(v["level"] / 10) * numdice) + diesize
        setAttrs({
            "wep3-damageroll": damagedice + brutal,
            "wep3-critdmg": highcrit + v["quest"] + "d6 + " + String(maxdice(damagedice) + v["wep3-damageflat"])
        });
    });
});

