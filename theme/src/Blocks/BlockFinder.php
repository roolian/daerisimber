<?php

namespace Daerisimber\Blocks;

class BlockFinder
{
    /**
     * @var []
     */
    public array $blocks ;

    public string $block_folder_path = '/blocks';

    public function __construct()
    {
        $this->blocks = $this->find_all_blocks();
    }

    public function find_all_blocks(): array
    {
        $temp_blocks = [];
        $blocks_directory = get_template_directory() . $this->block_folder_path;

        /** @var \SplFileInfo $file   */
        foreach (self::filesIn($blocks_directory) as $file) {

            $temp_blocks[$file->getPathInfo()->getBasename()] = $file->getPathname();
            //$this->load_paths[] = $file->getPathInfo()->getRealPath();
        }
        asort($temp_blocks);

        return $temp_blocks;
    }

    private static function filesIn(string $path): \Generator
    {
        if (! is_dir($path)) {
            throw new \RuntimeException("{$path} is not a directory ");
        }

        $it = new \RecursiveDirectoryIterator($path);
        $it = new \RecursiveIteratorIterator($it);
        $it = new \RegexIterator($it, '/block.json$/', \RegexIterator::MATCH);

        yield from $it;
    }
}
