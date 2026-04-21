<?php

namespace App\Console\Commands;

use App\Events\StockUpdated;
use App\Models\Product;
use App\Models\User;
use Illuminate\Console\Command;

class TestNotification extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-notification';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dispatch a mock StockUpdated event to test Pusher notifications';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $product = Product::first();
        $user = User::first();

        if (!$product || !$user) {
            $this->error('Ensure you have at least one product and one user in the database.');
            return;
        }

        $movementTypes = ['IN', 'OUT', 'ADJUSTMENT'];
        $type = $movementTypes[array_rand($movementTypes)];

        $this->info("Dispatching StockUpdated event for '{$product->name}' with type '{$type}'...");

        event(new StockUpdated($product, $user, $type));

        $this->info('Event dispatched successfully! Check your browser for the notification toast.');
    }
}
