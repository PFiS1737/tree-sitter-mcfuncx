/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "mcfuncx",

  extras: ($) => [/\s/, /\\\r?\n/, $.comment],

  conflicts: ($) => [[$._identifier_chain, $.nbt_path]],

  // TODO: word
  // word: ($) => $.identifier,

  rules: {
    root: ($) => repeat(seq($.command, /\r?\n/)),

    command: ($) =>
      seq(optional("/"), $.command_name, repeat(seq(" ", $._command_params))),

    _command_params: ($) =>
      prec(
        100,
        choice(
          $._C_identifier,
          $._C_number,

          $.range,
          $.string,
          $.axis,
          $.boolean,
          $.operator,
          $.object_like,

          $.array_like,

          $.nbt_path,

          $.subcommand_keyword,

          // HACK: any better way to detect chained-command?
          prec(
            150,
            seq(alias("run", $.subcommand_keyword), " ", $.command_name)
          )
        )
      ),

    command_name: () => seq(optional("$"), repeat1(/\w/)),

    _C_identifier: ($) => choice($.identifier, $.identifier_composite),

    identifier: ($) =>
      prec(
        50,
        choice(
          "*",
          $._identifier_plain,
          $._identifier_uuid,
          $._identifier_chain,
          $._identifier_path,
          $._identifier_namespaced,
          $._identifier_macro
        )
      ),

    _identifier_plain: ($) =>
      seq(
        choice(
          /[a-zA-Z_@#]/,
          alias($._escape_sequence_section, $.escape_sequence)
        ),
        repeat(
          choice(/\w/, alias($._escape_sequence_section, $.escape_sequence))
        )
      ),

    _identifier_uuid: () =>
      /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/,

    _identifier_chain: ($) =>
      seq(
        $._identifier_plain,
        repeat1(
          prec.left(
            5,
            seq(choice(".", "-"), choice($._identifier_plain, $._integer))
          )
        )
      ),

    _identifier_path: ($) =>
      sep1_repeat1("/", choice($._identifier_plain, $._identifier_chain)),

    _identifier_namespaced: ($) =>
      seq(
        field(
          "namespace",
          alias(choice($._identifier_plain, $._identifier_chain), $.identifier)
        ),
        ":",
        choice($._identifier_plain, $._identifier_chain)
      ),

    // TODO: ~$(key)
    _identifier_macro: ($) =>
      seq("$", "{", alias($._identifier_plain, $.macro_key), "}"),

    identifier_composite: ($) =>
      seq(
        alias(
          choice($._identifier_plain, $._identifier_namespaced),
          $.identifier
        ),
        repeat1(choice($.object_like, $.array_like))
      ),

    escape_sequence: ($) =>
      choice(
        $._escape_sequence_backslash,
        $._escape_sequence_section,
        $._escape_sequence_percent
      ),

    _escape_sequence_backslash: () => token.immediate(seq("\\", /['"/n\\]/)),
    _escape_sequence_section: () => token.immediate(seq("§", /[a-z0-9]/)),
    _escape_sequence_percent: () => token.immediate(seq("%%", /[0-9s]/)),

    _string: ($) =>
      choice(
        seq(
          '"',
          repeat(choice(token.immediate(/[^"§%\n\\]+/), $.escape_sequence)),
          '"'
        ),
        seq(
          "'",
          repeat(choice(token.immediate(/[^'§%\n\\]+/), $.escape_sequence)),
          "'"
        )
      ),
    string: ($) => $._string,

    _integer: () => token(seq(optional(choice("+", "-")), /\d+/)),
    integer: ($) => $._integer,

    _float: () => token(seq(optional(choice("+", "-")), /\d*/, ".", /\d+/)),
    float: ($) => $._float,

    _C_number: ($) => choice($.integer, $.float),

    range: ($) =>
      choice(
        seq($._C_number, "..", $._C_number),
        prec.left(5, seq($._C_number, "..")),
        prec.left(5, seq("..", $._C_number))
      ),

    boolean: () => choice("true", "false"),

    axis: ($) =>
      choice(
        prec.left(5, seq("~", optional($._C_number))),
        prec.left(5, seq("^", optional($._C_number)))
      ),

    _keyable: ($) => choice($.identifier, $.string, $.integer),

    _valuable: ($) =>
      choice(
        $._C_identifier,
        $._C_number,
        $._C_nbt_number,
        $._C_nbt_array,

        $.range,
        $.string,
        $.axis,
        $.boolean,
        $.object_like,
        $.array_like
      ),

    _equal_ky: ($) =>
      sep1_repeat(
        ",",
        seq(
          field("key", $._keyable),
          choice("=", "=!"),
          optional(field("value", $._valuable))
        )
      ),

    _colon_ky: ($) =>
      sep1_repeat(
        ",",
        seq(
          field("key", $._keyable),
          ":",
          optional(field("value", $._valuable))
        )
      ),

    object_like: ($) =>
      prec(
        10,
        choice(
          seq("[", optional(choice($._colon_ky, $._equal_ky)), "]"),
          seq("{", optional(choice($._colon_ky, $._equal_ky)), "}")
        )
      ),

    _itemable: ($) =>
      choice(
        $._C_number,
        $._C_nbt_number,

        $.string,
        $.boolean,
        $.object_like
      ),

    array_like: ($) =>
      seq("[", sep_repeat(",", field("item", $._itemable)), "]"),

    operator: () =>
      choice("=", "+=", "-=", "*=", "/=", "%=", "><", ">", "<", ">=", "<="),

    _C_nbt_number: ($) =>
      choice($.nbt_byte, $.nbt_long, $.nbt_short, $.nbt_float, $.nbt_double),

    nbt_byte: ($) => seq($._integer, choice("b", "B")),
    nbt_long: ($) => seq($._integer, choice("l", "L")),
    nbt_short: ($) => seq($._integer, choice("s", "S")),
    nbt_float: ($) => seq($._float, choice("f", "F")),
    nbt_double: ($) => seq($._float, choice("d", "D")),

    _C_nbt_array: ($) =>
      choice($.nbt_long_array, $.nbt_byte_array, $.nbt_integer_array),

    nbt_long_array: ($) =>
      seq(
        "[",
        field("flag", "L"),
        ";",
        sep_repeat(",", field("item", $.nbt_long)),
        "]"
      ),
    nbt_integer_array: ($) =>
      seq(
        "[",
        field("flag", "I"),
        ";",
        sep_repeat(",", field("item", $.integer)),
        "]"
      ),
    nbt_byte_array: ($) =>
      seq(
        "[",
        field("flag", "B"),
        ";",
        sep_repeat(",", field("item", choice($.nbt_byte, $.boolean))),
        "]"
      ),

    nbt_path: ($) =>
      seq(
        choice(
          alias($._identifier_plain, $.identifier),
          $.identifier_composite
        ),
        repeat1(
          seq(
            ".",
            choice(
              alias($._identifier_plain, $.identifier),
              $.identifier_composite,
              $.string
            )
          )
        )
      ),

    comment: () => token(prec(-10, /#.*/)),

    // HACK: any better way to detect subcommand keyword
    // TODO: my other project `mcbe-command-tools` would export all keyword
    subcommand_keyword: () =>
      choice(
        "detect",
        "align",
        "anchored",
        "as",
        "at",
        "facing",
        "in",
        "on",
        "positioned",
        "rotated",
        "store",
        "block",
        "bossbar",
        "entity",
        "score",
        "storage",
        "summon",
        "if",
        "unless",
        "biome",
        "blocks",
        "data",
        "dimension",
        "function",
        "loaded",
        "predicate",
        "matches",
        "structure",
        "poi",
        "objectives",
        "list",
        "add",
        "remove",
        "setdisplay",
        "modify",
        "players",
        "get",
        "set",
        "random",
        "reset",
        "display",
        "test",
        "enable",
        "disable",
        "operation",
        "stop",
        "dummy",
        "sidebar",
        "belowname",
        "result",
        "success",
        "with"
      ),
  },
})

/**
 * @param {RuleOrLiteral} separator
 * @param {RuleOrLiteral} rule
 *
 * @return {SeqRule}
 */
function sep1_repeat(separator, rule) {
  return seq(rule, repeat(seq(separator, rule)))
}

/**
 * @param {RuleOrLiteral} separator
 * @param {RuleOrLiteral} rule
 *
 * @return {ChoiceRule}
 */
function sep_repeat(separator, rule) {
  return optional(sep1_repeat(separator, rule))
}

/**
 * @param {RuleOrLiteral} separator
 * @param {RuleOrLiteral} rule
 *
 * @return {SeqRule}
 */
function sep1_repeat1(separator, rule) {
  return seq(rule, repeat1(seq(separator, rule)))
}
