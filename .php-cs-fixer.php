<?php

return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR12' => true,
        'array_indentation' => true,
        'array_syntax' => ['syntax' => 'short'],
        'trim_array_spaces' => true,
        'multiline_whitespace_before_semicolons' => false,
        'single_quote' => true,
        'concat_space' => ['spacing' => 'one'],
        'no_whitespace_before_comma_in_array' => true,
        'no_whitespace_in_blank_line' => true,
        'no_extra_blank_lines' => true,
    ])
    // ->setIndent("\t")
    ->setLineEnding("\n")
;