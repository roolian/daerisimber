<?php
namespace Daerisimber;

class Vite
{
    public string $env = 'production';

    public static string $hmr_host  = 'http://localhost:3000';
    public string $dist_uri;
    public string $dist_path;
    public static string $js_file = 'theme/assets/main.js';
    public static string $editor_css_file = 'theme/assets/styles/editor-style.css';
    public ?array $manifest  = null;

    public array $config;

    public function __construct()
    {
        $this->dist_uri = get_template_directory_uri() . '/assets/dist';
        $this->dist_path = get_template_directory() . '/assets/dist';

        if (file_exists(get_template_directory() . '/../config.json')) {
            $this->config   = json_decode(file_get_contents(get_template_directory() . '/../config.json'), true);
            $this->env = $this->config['vite']['environment'] ?? 'production';
        }

        if (file_exists($this->dist_path . '/.vite/manifest.json')) {
            $this->manifest = json_decode(file_get_contents($this->dist_path . '/.vite/manifest.json'), true);
        }

        if ($this->dev_assets_wanted()) {
            add_action('wp_head', [$this,'enqueue_dev_assets']);
            add_action('admin_head', [$this,'enqueue_admin_dev_assets']);
        } else {
            add_action('wp_enqueue_scripts', [$this, 'enqueue_prod_assets']);
            add_action('enqueue_block_assets', [$this, 'enqueue_editor_style']);
            add_action('enqueue_block_editor_assets', [$this, 'enqueue_block_editor_assets']);
        }

    }

    public function enqueue_dev_assets()
    {
        printf('<script type="module" crossorigin src="%s/@vite/client"></script>', self::$hmr_host);
        printf('<script type="module" crossorigin src="%s/%s"></script>', self::$hmr_host, self::$js_file);
    }

    public function enqueue_prod_assets()
    {
        //dump($this->get_main_style());
        wp_enqueue_style('main', $this->get_main_style());
        wp_enqueue_script(
            'main',
            $this->get_main_script(),
            [],
            '',
            [
                'strategy'  => 'defer',
                'in_footer' => true,
            ]
        );

        // wp_enqueue_style('prefix-editor-font', '//fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap');
        add_editor_style($this->get_editor_style());
    }

    public function enqueue_editor_style()
    {
        // dump($this->get_editor_style());
        /*add_editor_style([
            $this->get_editor_style(),
        ]);*/

        wp_enqueue_style('editor', $this->get_editor_style());
    }

    public function dev_assets_wanted(): bool
    {
        return $this->env === 'development' && !is_admin() ;
    }

    public function get_main_script(): string|false
    {
        if (is_array($this->manifest)) {
            return $this->dist_uri . '/' . $this->manifest[ self::$js_file ]['file'];
        }

        return false;
    }
    public function get_main_style(): string|false
    {
        if (is_array($this->manifest)) {
            return $this->dist_uri . '/' . $this->manifest[ self::$js_file ]['css'][0];
        }

        return false;
    }
    public function get_editor_style(): string|false
    {

        if (is_array($this->manifest)) {
            return $this->dist_uri . '/' . $this->manifest[ self::$editor_css_file ]['file'];
        }

        return false;
    }

    public function enqueue_block_editor_assets()
    {

        //wp_deregister_style('wp-reset-editor-styles');
        /*
            wp_enqueue_script(
                'custom-block-editor-script',
                get_stylesheet_directory_uri() . '/assets/dist/assets/editor.js',
                ['wp-blocks', 'wp-dom'],
                filemtime(get_stylesheet_directory() . '/assets/dist/assets/editor.js'),
                true
            ); */
    }

    public function file_exists_2($fileUrl)
    {
        $file_headers = get_headers($fileUrl);
        //var_dump($file_headers);
        if(!$file_headers || $file_headers[0] == 'HTTP/1.1 404 Not Found') {
            $exists = false;
        } else {
            $exists = true;
        }
        return $exists;
    }
}
