<?php

namespace Daeristwo\Modules\Faq\Utils;

use Yoast\WP\SEO\Generators\Schema\Faq;
use Yoast\WP\SEO\Context\Meta_Tags_Context;

class YoastFaqGraphPiece extends Faq
{
    private array $questionPosts;
    /**
     * Determines whether or not a piece should be added to the graph.
     *
     * @return bool Whether or not a piece should be added.
     */
    public function is_needed()
    {
        if (empty($this->context->blocks['acf/faq-page'])) {
            return false;
        }
        $this->questionPosts = get_posts([
            'post_type'   => 'question',
            'numberposts' => -1,
        ]);

        if (!$this->questionPosts) {
            return false;
        }

        if (! \is_array($this->context->schema_page_type)) {
            $this->context->schema_page_type = [ $this->context->schema_page_type ];
        }
        $this->context->schema_page_type[]  = 'FAQPage';
        $this->context->main_entity_of_page = $this->generate_ids();

        

        return true;
    }


    public function generate_ids()
    {
        $ids = [];
        foreach ($this->questionPosts as $post) {
            $ids[] = [ '@id' => $this->context->canonical . '#' . \esc_attr($post->ID) ];
        }

        return $ids;
    }

    /**
     * Adds our piece of the graph.
     *
     * @return array Schema markup.
     */
    public function generate()
    {
        $graph = [];
        foreach ($this->questionPosts as $post) {
            $url = $this->context->canonical . '#' . \esc_attr($post->ID);
            $graph[] = [
                    "@type" => "Question",
                    "@id" => $url,
                    "url" => $url,
                    "name" => $post->post_title,
                    'answerCount'    => 1,
                    "acceptedAnswer" => [
                        "@type" => "Answer",
                        "text" => $post->post_content,
                    ]
                ];
        }
        

        return $graph;
    }
}
