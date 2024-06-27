<?php

namespace Daerisimber\Blocks;

use Timber\Timber;

class BlockRender
{
    public array $block;
    public string $content;
    public bool $is_preview;
    public int $post_id;
    public array $context;
    public array $timber_context;
    public array|false $fields;
    public string $name;

    /**
     * construct
     *
     * @param    array    $attributes The block attributes.
     * @param    string   $content The block content.
     * @param    bool     $is_preview Whether or not the block is being rendered for editing preview.
     * @param    int      $post_id The current post being edited or viewed.
     * @param    \WP_Block $wp_block The block instance (since WP 5.5).
     */
    public function render(array $block, string $content, bool $is_preview, int $post_id, \WP_Block $wp_block = null, array $context)
    {
        $this->block = $block;
        $this->content = $content;
        $this->is_preview = $is_preview;
        $this->post_id = $post_id;
        $this->context = $context;
        $this->fields = get_fields();
        $this->name = explode('/', $block['name'])[1];

        if (!$this->fields) {
            $this->fields = $block['data'];
        }
        $this->timber_context           = Timber::context();
        $this->timber_context['post']   = Timber::get_post();
        $this->timber_context['block']  = $block;
        $this->timber_context['fields'] = $this->fields;
        $this->timber_context['context'] = $context;
        $this->timber_context['post_id'] = $post_id;
        $this->timber_context['is_preview'] = $is_preview;

        $this->custom_construct();

        $template  = [$this->block['path'] . '/' . $this->name . '.twig', $this->block['path'] . '/index.twig'];
        Timber::render($template, $this->timber_context);
    }

    public function custom_construct()
    {
        //To be overrided
    }



}
