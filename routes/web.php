<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\LeadController as AdminLeadController;
use App\Http\Controllers\Admin\PageController as AdminPageController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\SiteSettingController as AdminSiteSettingController;
use App\Http\Controllers\Admin\SuccessCaseController as AdminSuccessCaseController;
use App\Http\Controllers\Admin\TestimonialController as AdminTestimonialController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DigitalSolutionController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LegacyRedirectController;
use App\Http\Controllers\LegalPageController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SeoLandingPageController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\SuccessCaseController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/servicios', [ServiceController::class, 'index'])->name('services.index');
Route::get('/servicios/{service:slug}', [ServiceController::class, 'show'])->name('services.show');
Route::get('/soluciones-digitales', [DigitalSolutionController::class, 'index'])->name('digital-solutions.index');
Route::get('/soluciones-digitales/{service:slug}', [DigitalSolutionController::class, 'show'])->name('digital-solutions.show');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{post:slug}', [BlogController::class, 'show'])->name('blog.show');
Route::get('/casos-de-exito', [SuccessCaseController::class, 'index'])->name('success-cases.index');
Route::get('/casos-de-exito/{successCase:slug}', [SuccessCaseController::class, 'show'])->name('success-cases.show');
Route::get('/quienes-somos', [PageController::class, 'about'])->name('pages.about');
Route::get('/politica-de-privacidad', [LegalPageController::class, 'privacy'])->name('legal.privacy');
Route::get('/politica-de-cookies', [LegalPageController::class, 'cookies'])->name('legal.cookies');
Route::get('/aviso-legal', [LegalPageController::class, 'notice'])->name('legal.notice');
Route::get('/contacto', [ContactController::class, 'index'])->name('contact.index');
Route::post('/contacto', [ContactController::class, 'store'])->middleware('throttle:5,1')->name('contact.store');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::get('/{path}', [SeoLandingPageController::class, 'show'])
    ->where('path', 'servicios/.+')
    ->name('seo-landings.show');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('index');
        Route::resource('services', AdminServiceController::class)->except('show');
        Route::resource('categories', AdminCategoryController::class)->except('show');
        Route::resource('posts', AdminPostController::class)->except('show');
        Route::resource('pages', AdminPageController::class)->except('show');
        Route::resource('success-cases', AdminSuccessCaseController::class)->except('show');
        Route::resource('testimonials', AdminTestimonialController::class)->except('show');
        Route::resource('users', AdminUserController::class)->except('show');
        Route::get('site-settings/edit', [AdminSiteSettingController::class, 'edit'])->name('site-settings.edit');
        Route::patch('site-settings', [AdminSiteSettingController::class, 'update'])->name('site-settings.update');
        Route::get('leads', [AdminLeadController::class, 'index'])->name('leads.index');
        Route::get('leads/{lead}', [AdminLeadController::class, 'show'])->name('leads.show');
        Route::patch('leads/{lead}/status', [AdminLeadController::class, 'updateStatus'])->name('leads.status');
        Route::delete('leads/{lead}', [AdminLeadController::class, 'destroy'])->name('leads.destroy');
    });
});

require __DIR__.'/settings.php';

Route::match(['POST', 'PUT', 'PATCH', 'DELETE'], '/{unmatched}', fn () => abort(404))
    ->where('unmatched', '.*');
Route::fallback(LegacyRedirectController::class);
